use serde::{Deserialize, Serialize};
/*
// 定义一个main函数，用于测试index_of函数
fn main1() {
    // 定义一个UTF-8字符串，包含中英文和表情符号
    let s = "Hello!🌍你好,世界！Hello👋";
    // 打印s的长度（以字节为单位）
    println!("s.len() = {}", s.len());
    // 打印s的长度（以字符为单位）
    println!("s.chars().count() = {}", s.chars().count());
    // 测试一些常见的情况
    println!("index_of(s, \"Hello\") = {}", index_of(s, "Hello"));
    println!("index_of(s, \"你好\") = {}", index_of(s, "你好"));
    println!("index_of(s, \"🌍\") = {}", index_of(s, "🌍"));
    println!("index_of(s, \"👋\") = {}", index_of(s, "👋"));
    println!("index_of(s, \"World\") = {}", index_of(s, "World"));
    println!("index_of(s, \"\") = {}", index_of(s, ""));
    println!("index_of(\"\", \"Hello\") = {}", index_of("", "Hello"));
}

// 定义一个main函数，用于测试sub_string函数
fn main2() {
    // 定义一个UTF-8字符串，包含中英文和表情符号
    let s = "Hello!🌍你好,世界！Hello👋";
    // 打印s的长度（以字节为单位）
    println!("s.len() = {}", s.len());
    // 打印s的长度（以字符为单位）
    println!("s.chars().count() = {}", s.chars().count());
    // 测试一些常见的情况
    println!("sub_string(s, 0, 5) = {}", sub_string(s, 0, 5));
    println!("sub_string(s, 6, 8) = {}", sub_string(s, 6, 8));
    println!("sub_string(s, 9, 13) = {}", sub_string(s, 9, 13));
    println!("sub_string(s, 14, 19) = {}", sub_string(s, 14, 19));
    println!("sub_string(s, 0, 0) = {}", sub_string(s, 0, 0));
    println!("sub_string(s, 5, 5) = {}", sub_string(s, 5, 5));
    println!("sub_string(s, 0, 20) = {}", sub_string(s, 0, 20));
}


// 定义一个main函数，用于测试find_text函数
fn main3() {
    // 定义一些测试数据
    let source = "Hello!🌍你好,世界！Hello👋Hello";
    let keyword = "Hello";
    let pre_length = 2;
    let suf_length = 3;

    // 调用find_text函数，不限制匹配次数，打印结果数组
    println!("{:?}", find_text(1, source, keyword, 2, 3));

    // 调用find_text函数，限制匹配次数为2，打印结果数组
    println!("{:?}", find_text(2, source, keyword, 99, 9));
}
*/

// 定义一个index_of函数，接受两个字符串参数：source和target
// 返回target在source中第一次出现的位置（以字符为单位），如果没有找到则返回-1
fn index_of(source: &str, target: &str) -> i32 {
    // 如果target为空，则返回0
    if target.is_empty() {
        return 0;
    }
    // 如果source为空，则返回-1
    if source.is_empty() {
        return -1;
    }
    // 将source和target转换为字符向量
    let source_chars: Vec<char> = source.chars().collect();
    let target_chars: Vec<char> = target.chars().collect();
    // 获取source和target的长度（以字符为单位）
    let source_len = source_chars.len();
    let target_len = target_chars.len();
    // 如果target的长度大于source的长度，则返回-1
    if target_len > source_len {
        return -1;
    }
    // 从source的第一个字符开始遍历
    for i in 0..=source_len - target_len {
        // 假设找到了匹配
        let mut found = true;
        // 遍历target的每个字符
        for j in 0..target_len {
            // 如果source和target的对应字符不相等，则说明没有匹配，跳出循环
            if source_chars[i + j] != target_chars[j] {
                found = false;
                break;
            }
        }
        // 如果找到了匹配，则返回当前位置
        if found {
            return i as i32;
        }
    }
    // 如果遍历完source都没有找到匹配，则返回-1
    -1
}


// 定义一个sub_string函数，接受一个字符串参数和两个整数参数：source, start, end
// 返回source中从start到end（不包含end）的子字符串（以字符为单位），如果start或end超出范围则返回空字符串
fn sub_string(source: &str, start: usize, end: usize) -> String {
    let mut real_end = end;

    // 如果start大于等于end，则返回空字符串
    if start >= real_end {
        return String::new();
    }
    // 将source转换为字符向量
    let source_chars: Vec<char> = source.chars().collect();
    // 获取source的长度（以字符为单位）
    let source_len = source_chars.len();
    // 如果start或end超出范围，则返回空字符串
    if start >= source_len {
        return String::new();
    }

    if real_end > source_len {
        real_end = source_len;
    }
    // 创建一个空的String类型变量，用于存储子字符串
    let mut result = String::new();
    // 从start到end（不包含end）遍历source_chars
    for i in start..real_end {
        // 将当前字符追加到result中
        result.push(source_chars[i]);
    }
    // 返回result
    result
}

// 定义一个find_text函数，接受五个参数：source, keyword, pre_length, suf_length, match_num
// 返回一个数组，数组中的每个元素是一个结构体，包含prefix, suffix, match_num三个字段
fn find_text(row_num: usize, source: &str, keyword: &str, pre_length: usize, suf_length: usize) -> Vec<Match> {
    // 定义一个空的数组，用于存储结果
    let mut result: Vec<Match> = Vec::new();
    // 定义一个变量，用于记录当前已经找到的匹配次数
    // let mut count = 0;
    // 定义一个变量，用于记录当前查找的起始位置
    let mut start = 0;
    // // 如果match_num为0或负数，则表示不限制匹配次数，否则表示最多匹配match_num次
    // let limit = match_num <= 0;
    // 循环查找keyword，直到找不到或达到限制
    while let Some(index) = Some(index_of(&sub_string(source, start, source.chars().count()), keyword)) {
        // 如果index为-1，则表示没有找到匹配，跳出循环
        if index == -1 {
            break;
        }

        // 计算keyword在source中的实际位置
        let pos = start + index as usize;
        // 计算prefix和suffix的起始和结束位置，注意不要超出source的范围
        let pre_start = if pos >= pre_length { pos - pre_length } else { 0 };
        let pre_end = pos;
        let suf_start = pos + keyword.len();
        let suf_end = if suf_start + suf_length <= source.len() { suf_start + suf_length } else { source.len() };
        // 获取prefix和suffix
        let mut prefix = sub_string(source, pre_start, pre_end);
        let suffix = sub_string(source, suf_start, suf_end);

        if pre_start > 0 && !prefix.is_empty() {
            prefix = format!("...{}", prefix);
        }

        // 创建一个Match结构体，并将其添加到结果数组中
        result.push(Match {
            prefix,
            suffix,
            row_num,
        });
        // 更新已经找到的匹配次数和查找的起始位置
        // count += 1;
        start = pos + keyword.len();
        // 如果达到了限制，则跳出循环
        // if !limit && count == match_num {
        //     break;
        // }
    }
    // 返回结果数组
    result
}

// 定义一个Match结构体，用于存储每次匹配的信息
#[derive(Debug, Deserialize, Serialize)]
pub struct Match {
    prefix: String,
    suffix: String,
    row_num: usize,
}


// 定义一个SearchResult结构体，用于存储每个文件的搜索结果
#[derive(Debug, Deserialize, Serialize)]
pub struct SearchResult {
    filepath: String,
    matches: Vec<Match>,
}

// 定义一个search_keyword_in_file函数，接受五个参数：path, keyword, pre_length, suf_length, match_num
// 返回一个数组，数组中的每个元素是一个结构体，包含filepath和matches两个字段
fn search_keyword_in_file(path: &str, keyword: &str, pre_length: usize, suf_length: usize) -> Vec<SearchResult> {
    // 定义一个空的数组，用于存储结果
    let mut result: Vec<SearchResult> = Vec::new();
    // 使用std::fs::read_dir方法来读取path中的所有文件和文件夹
    if let Ok(entries) = std::fs::read_dir(path) {
        // 遍历每一个条目
        for entry in entries {
            // 如果条目是有效的
            if let Ok(entry) = entry {
                // 获取条目的路径
                let entry_path = entry.path();
                // 判断条目是否是文件
                if entry_path.is_dir() {
                    // 如果是文件夹，就递归地调用search_keyword_in_file函数，并将结果追加到结果数组中
                    result.extend(search_keyword_in_file(entry_path.to_str().unwrap_or_default(), keyword, pre_length, suf_length));
                } else {
                    // 获取条目的扩展名
                    let extension = entry_path.extension().unwrap_or_default();
                    // 判断扩展名是否是md（表示markdown文件）
                    if extension == "md" {
                        // 获取条目的路径字符串
                        let filepath = entry_path.to_str().unwrap_or_default();
                        // 使用std::fs::read_to_string方法来读取文件的内容
                        if let Ok(content) = std::fs::read_to_string(filepath) {
                            // 定义一个空的数组，用于存储匹配信息
                            let mut matches: Vec<Match> = Vec::new();

                            // 使用str::lines方法来将内容分割成多行，并遍历每一行
                            for (row_num, line) in content.lines().enumerate() {
                                // 使用find_text函数来查找关键词，并将结果追加到匹配信息数组中
                                matches.extend(find_text(row_num , line, keyword, pre_length, suf_length));
                            }
                            // 如果匹配信息数组不为空，则创建一个SearchResult结构体，并将其添加到结果数组中
                            if !matches.is_empty() {
                                result.push(SearchResult {
                                    filepath: filepath.to_string(),
                                    matches,
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    // 返回结果数组
    result
}

//path: &str, keyword: &str, pre_length: usize, suf_length: usize

#[tauri::command]
pub fn search_text(path: String, keyword: String, length: usize) -> Vec<SearchResult> {
    println!("{:?},{:?},{:?}", path, keyword, length);
    search_keyword_in_file(path.as_str(), keyword.as_str(), length, length * 2)
}
