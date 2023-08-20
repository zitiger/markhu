use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

pub fn get_menu() -> Menu {
    let authors = vec!["zitiger".to_string()];
    let mut aboutmetadata = AboutMetadata::new();
    aboutmetadata = aboutmetadata.version("0.1.0");
    aboutmetadata = aboutmetadata.authors(authors);
    aboutmetadata = aboutmetadata.comments("MarkHu".to_string());
    aboutmetadata = aboutmetadata.copyright("zitiger".to_string());
    aboutmetadata = aboutmetadata.license("MIT".to_string());

    // 创建自定义的菜单项
    let open_file = CustomMenuItem::new("open_file", "Open File").accelerator("CmdOrControl+O");
    let open_folder = CustomMenuItem::new("open_folder", "Open Folder").accelerator("CmdOrControl+D");
    let create_file = CustomMenuItem::new("create_file", "Create File").accelerator("CmdOrControl+N");
    let create_folder = CustomMenuItem::new("create_folder", "Create Folder").accelerator("CmdOrControl+R");
    let save_file = CustomMenuItem::new("save_file", "Save File").accelerator("CmdOrControl+S");
    let save_as = CustomMenuItem::new("save_as", "Save As").accelerator("CmdOrControl+Shift+S");
    let save_all = CustomMenuItem::new("save_all", "Save All").accelerator("CmdOrControl+Option+S");
    let close_file = CustomMenuItem::new("close_file", "Close File").accelerator("CmdOrControl+W");
    let close_all = CustomMenuItem::new("close_all", "Close All").accelerator("CmdOrControl+W");
    let about_menu = Menu::new()
        .add_native_item(MenuItem::About(
            "MarkHu".to_string(),
            aboutmetadata,
        ));

    // Create History Menu
    let mut open_recent_menu = Menu::new();
    for i in 0..=9 {
        let history_file_id = format!("history_file_{}", i);
        open_recent_menu = open_recent_menu.add_item(CustomMenuItem::new(history_file_id, "--"));
    }
    open_recent_menu = open_recent_menu.add_native_item(MenuItem::Separator);

    let more_history = CustomMenuItem::new("more_history", "More History");//.accelerator("CmdOrControl+O");
    open_recent_menu = open_recent_menu.add_item(more_history);

    open_recent_menu = open_recent_menu.add_native_item(MenuItem::Separator);

    let clear_history = CustomMenuItem::new("clear_history", "Clear History");//.accelerator("CmdOrControl+O");
    open_recent_menu = open_recent_menu.add_item(clear_history);

    let open_recent = Submenu::new("Open Recent", open_recent_menu);

    let file_menu = Menu::new()
        .add_item(open_file)
        .add_item(open_folder)
        .add_submenu(open_recent)
        .add_native_item(MenuItem::Separator)
        .add_item(create_file)
        .add_item(create_folder)
        .add_native_item(MenuItem::Separator)
        .add_item(save_file)
        .add_item(save_as)
        .add_item(save_all)
        .add_native_item(MenuItem::Separator)
        .add_item(close_file)
        .add_item(close_all)
        ;

    let edit_menu = Menu::new()
        .add_native_item(MenuItem::Undo)
        .add_native_item(MenuItem::Redo)
        .add_native_item(MenuItem::Separator)
        .add_native_item(MenuItem::Cut)
        .add_native_item(MenuItem::Copy)
        .add_native_item(MenuItem::Paste)
        .add_native_item(MenuItem::SelectAll);

    let theme_auto = CustomMenuItem::new("theme_auto", "Auto");//.accelerator("CmdOrControl+O");
    let theme_dark = CustomMenuItem::new("theme_dark", "Dark");//.accelerator("CmdOrControl+O");
    let theme_light = CustomMenuItem::new("theme_light", "Light");//.accelerator("CmdOrControl+O");
    let theme_menu = Menu::new()
        .add_item(theme_auto)
        .add_item(theme_dark)
        .add_item(theme_light);

    let locale_zh_cn = CustomMenuItem::new("locale_zh_cn", "中文");//.accelerator("CmdOrControl+O");
    let locale_en_us = CustomMenuItem::new("locale_en_us", "English");//.accelerator("CmdOrControl+O");
    let locale_menu = Menu::new()
        .add_item(locale_zh_cn)
        .add_item(locale_en_us);

    let mode_wysiwyg = CustomMenuItem::new("mode_wysiwyg", "WYSIWYG");//.accelerator("CmdOrControl+O");
    let mode_ir = CustomMenuItem::new("mode_ir", "Instant Rendering");//.accelerator("CmdOrControl+O");
    let mode_sv = CustomMenuItem::new("mode_sv", "Split View");//.accelerator("CmdOrControl+O");
    let mode_fullscreen = CustomMenuItem::new("mode_fullscreen", "Toggle Full Screen");//.accelerator("CmdOrControl+O");
    let editor_menu = Menu::new()
        .add_item(mode_wysiwyg)
        .add_item(mode_ir)
        .add_item(mode_sv)
        .add_native_item(MenuItem::Separator)
        .add_item(mode_fullscreen)
        ;

    /*    let window_menu = Menu::new()
            .add_native_item(MenuItem::Minimize)
            .add_native_item(MenuItem::Zoom)
            .add_native_item(MenuItem::Hide)
            .add_native_item(MenuItem::Quit);*/

    // add all our childs to the menu (order is how they'll appear)
    Menu::new()
        .add_submenu(Submenu::new("MarkHu", about_menu)) // 第一个菜单项代表当前应用，这里的title字段无效
        .add_submenu(Submenu::new("File", file_menu))
        .add_submenu(Submenu::new("Edit", edit_menu))
        .add_submenu(Submenu::new("Theme", theme_menu))
        .add_submenu(Submenu::new("Language", locale_menu))
        .add_submenu(Submenu::new("Editor", editor_menu))
    // .add_submenu(Submenu::new("Window", window_menu))
}
