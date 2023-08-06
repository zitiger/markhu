use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu};

// 自定义菜单栏
pub fn get_menu() -> Menu {
    let authors = vec!["zitiger".to_string()];
    let mut aboutmetadata = AboutMetadata::new();
    aboutmetadata = aboutmetadata.version("0.1.0");
    aboutmetadata = aboutmetadata.authors(authors);
    aboutmetadata = aboutmetadata.comments("MarkHu".to_string());
    aboutmetadata = aboutmetadata.copyright("zitiger".to_string());
    aboutmetadata = aboutmetadata.license("MIT".to_string());

    // 创建自定义的菜单项
    let open_file = CustomMenuItem::new("open_file", "打开文件").accelerator("CmdOrControl+O");
    let open_folder = CustomMenuItem::new("open_folder", "打开文件夹").accelerator("CmdOrControl+D");
    let create_file = CustomMenuItem::new("create_file", "创建文件").accelerator("CmdOrControl+N");
    let save_file = CustomMenuItem::new("save_file", "保存文件").accelerator("CmdOrControl+S");
    let save_all = CustomMenuItem::new("save_all", "保存所有").accelerator("CmdOrControl+Shift+S");
    let close_file = CustomMenuItem::new("close_file", "关闭文件").accelerator("CmdOrControl+W");
    let about_menu = Menu::new()
        .add_native_item(MenuItem::About(
            "MarkHu".to_string(),
            aboutmetadata,
        ));

    let file_menu = Menu::new()
        .add_item(open_file)
        .add_item(open_folder)
        .add_native_item(MenuItem::Separator)
        .add_item(create_file)
        .add_native_item(MenuItem::Separator)
        .add_item(save_file)
        .add_item(save_all)
        .add_native_item(MenuItem::Separator)
        .add_item(close_file)
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

    let lang_zh_cn = CustomMenuItem::new("lang_zh_cn", "中文");//.accelerator("CmdOrControl+O");
    let lang_en = CustomMenuItem::new("lang_en_us", "English");//.accelerator("CmdOrControl+O");
    let lang_menu = Menu::new()
        .add_item(lang_zh_cn)
        .add_item(lang_en);

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

    let window_menu = Menu::new()
        .add_native_item(MenuItem::Minimize)
        .add_native_item(MenuItem::Zoom)
        .add_native_item(MenuItem::Hide)
        .add_native_item(MenuItem::Quit);

    // add all our childs to the menu (order is how they'll appear)
    Menu::new()
        .add_submenu(Submenu::new("MarkHu", about_menu)) // 第一个菜单项代表当前应用，这里的title字段无效
        .add_submenu(Submenu::new("File", file_menu))
        .add_submenu(Submenu::new("Edit", edit_menu))
        .add_submenu(Submenu::new("Theme", theme_menu))
        .add_submenu(Submenu::new("Language", lang_menu))
        .add_submenu(Submenu::new("Editor", editor_menu))
        .add_submenu(Submenu::new("Window", window_menu))
}
