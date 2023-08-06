// Prevents additional console window on Windows in release, DO NOT REMOVE!!

mod cmd;
mod menu;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs_watch::init())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .menu(menu::get_menu())
        .on_menu_event(|event| {
            let menu_id = event.menu_item_id();
            event.window().emit("top_menu_event", menu_id).expect("test");
            // 自定义菜单的点击事件
            println!("你刚才点击了:{:?}", event.menu_item_id());
        })
        .invoke_handler(tauri::generate_handler![
            cmd::get_md_in_folder,
            cmd::create_dir,
            cmd::create_file,
            cmd::save_content,
            cmd::save_image,
            cmd::get_content,
            cmd::read_folder,
            cmd::rename_file,
            cmd::remove_file,
            cmd::remove_dir_all,
            cmd::exist_path,
            cmd::show_in_folder,
            cmd::change_menu_title
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

