// Prevents additional console window on Windows in release, DO NOT REMOVE!!

mod cmd;
mod menu;
mod search;


fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window::init())
        .menu(menu::build_menu)
        .invoke_handler(tauri::generate_handler![
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
            menu::set_menu_selected ,
            cmd::get_theme,
            cmd::move_to_trash,
            search::search_text,
            menu::set_menu_text,
            menu::change_recent_menu
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

