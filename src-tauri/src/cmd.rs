use std::{fs, time::UNIX_EPOCH};
use std::io::Write;
use std::path::Path;

use tauri::{command};
use serde::{Deserialize, Serialize};

#[cfg(target_os = "linux")]
use std::{fs::metadata, path::PathBuf};
// use std::path::PathBuf;
use std::process::Command;
#[cfg(target_os = "linux")]
use fork::{daemon, Fork}; // dep: fork = "0.1"

// 定义一个结构体，表示文件或文件夹的信息
#[derive(Debug, Deserialize, Serialize)]
pub struct FileInfo {
    is_file: bool, // 用于标记是文件还是文件夹
    create_time: i64,
    update_time: i64,
    count: u64,
    file_path: String,
    children: Option<Vec<FileInfo>>, // 用于存储子项，如果是文件则为None
}


#[command]
pub fn get_md_in_folder(event: String) -> Option<String> {
    println!("the path is {}", event);
    Some("test".to_string())
}

#[command]
pub fn create_dir(path:String) -> Option<String> {
    let file = fs::create_dir_all(&path);

    match file {
        Ok(_) => {
            return Some(path)
        },
        Err(e) => {
            println!("error create dir===={}", e);
            return None;
        }
    }
}

#[command]
pub fn create_file(path:String) -> Option<String> {
    let file = fs::File::create(&path);

    match file {
        Ok(_) => {
            return Some(path)
        },
        Err(e) => {
            println!("error create file===={}", e);
            return None;
        }
    }
}

#[command]
pub fn save_content(filepath: String, content: String) -> Option<String> {
    fs::write(filepath, content).expect("write file error");
    Some("OK".to_string())
}

#[command]
pub fn get_content(filepath: String) -> Option<String> {
    let res = fs::read_to_string(filepath);
    match res {
        Ok(content) => Some(content),
        Err(_) => None
    }
}


// 定义一个函数，处理读取文件夹的请求，并返回一个FileOrDir数组
#[command]
pub fn read_folder(event: String) -> Option<Vec<FileInfo>> {
    read_folder_recursively(event)
}

// 定义一个函数，递归地读取文件夹内的文件和子文件夹，并返回一个FileInfo数组
fn read_folder_recursively(path: String) -> Option<Vec<FileInfo>> {
    let dirs = fs::read_dir(path);
    let mut res = vec![];
    match dirs {
        Ok(dir) => {
            for item in dir {
                if let Ok(entry) = item {
                    let meta_data = entry.metadata().expect("");
                    let update_time = meta_data.modified().expect("");
                    let since_the_epoch1 =
                        update_time.duration_since(UNIX_EPOCH).expect("get timestamp error");
                    let timestamp1 = since_the_epoch1.as_secs() as i64 * 1000i64
                        + (since_the_epoch1.subsec_nanos() as f64 / 1_000_000.0) as i64;

                    let create_time = meta_data.created().expect("");
                    let since_the_epoch2 =
                        create_time.duration_since(UNIX_EPOCH).expect("get timestamp error");
                    let timestamp2 = since_the_epoch2.as_secs() as i64 * 1000i64
                        + (since_the_epoch2.subsec_nanos() as f64 / 1_000_000.0) as i64;


                    // let ms = update_time.since_the_epoch.as_secs() as i64 * 1000i64 + (since_the_epoch.subsec_nanos() as f64 / 1_000_000.0) as i64;
                    let file_path = entry.path().display().to_string();

                    // 判断是文件还是文件夹
                    if meta_data.is_file() {
                        // 如果是文件，就创建一个FileInfo结构体，并设置is_file为true，children为None
                        res.push(FileInfo {
                            is_file: true,
                            create_time: timestamp2,
                            update_time: timestamp1,
                            count: meta_data.len(),
                            file_path,
                            children: None,
                        });
                    } else if meta_data.is_dir() {
                        // 如果是文件夹，就递归地调用自己，获取子项，并创建一个FileInfo结构体，并设置is_file为false，children为Some
                        res.push(FileInfo {
                            is_file: false,
                            create_time: timestamp2,
                            update_time: timestamp1,
                            count: meta_data.len(),
                            file_path: file_path.clone(),
                            children: Some(read_folder_recursively(file_path).unwrap_or_default()),
                        });
                    }
                }
            }

            return Some(res);
        }
        Err(_) => return None,
    }
}

#[command]
pub fn rename_file(from: String, to: String) -> Option<String> {
    fs::rename(from, to).expect("rename file error");
    Some("OK".to_string())
}

#[command]
pub fn remove_file(path: String) -> Option<String> {
    fs::remove_file(path).expect("remove file error");
    Some("OK".to_string())
}

#[command]
pub fn remove_dir_all(path: String) -> Option<String> {
    fs::remove_dir_all(path).expect("remove dir error");
    Some("OK".to_string())
}
#[command]
pub fn exist_path(path: &str) -> bool {
    Path::new(path).exists()
}

#[command]
pub fn save_image(path: String, data: Vec<u8>) -> Option<String>{
    let mut file = fs::File::create(path).expect("create image error");
    file.write_all(&data).expect("write file error");
    Some("OK".to_string())
}


#[tauri::command]
pub fn show_in_folder(path: String) {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .args(["/select,", &path]) // The comma after select is not a typo
            .spawn()
            .unwrap();
    }

    #[cfg(target_os = "linux")]
    {
        if path.contains(",") {
            // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
            let new_path = match metadata(&path).unwrap().is_dir() {
                true => path,
                false => {
                    let mut path2 = PathBuf::from(path);
                    path2.pop();
                    path2.into_os_string().into_string().unwrap()
                }
            };
            Command::new("xdg-open")
                .arg(&new_path)
                .spawn()
                .unwrap();
        } else {
            if let Ok(Fork::Child) = daemon(false, false) {
                Command::new("dbus-send")
                    .args(["--session", "--dest=org.freedesktop.FileManager1", "--type=method_call",
                        "/org/freedesktop/FileManager1", "org.freedesktop.FileManager1.ShowItems",
                        format!("array:string:\"file://{path}\"").as_str(), "string:\"\""])
                    .spawn()
                    .unwrap();
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(["-R", &path])
            .spawn()
            .unwrap();
    }
}

#[tauri::command]
pub fn change_menu_title(window: tauri::Window, id:String, title:String) ->Option<String> {
    let menu_handle =  window.menu_handle();
    std::thread::spawn(move || {
        menu_handle.get_item(&id).set_title(title).expect("Failed");
    });

    Some("OK".to_string())
}


#[tauri::command]
pub fn move_to_trash(path: String) -> Option<String> {
    trash::delete(path).expect("move to trash error");
    Some("OK".to_string())
}
