use tauri::{AppHandle, Error, Manager, Runtime};
use tauri::menu::{AboutMetadata, CheckMenuItem, Menu, MenuItem, PredefinedMenuItem, Submenu};

pub fn build_menu<R: Runtime>(app_handle: &AppHandle<R>) -> std::result::Result<Menu<R>, Error> {
    let app_menu = tauri::menu::SubmenuBuilder::with_id(app_handle, "app_menu", "&File").build()?;

    let about_metadata = AboutMetadata {
        name: Some("MarkHu".to_string()),
        version: None,
        short_version: None,
        authors: Some(vec!["zitiger".to_string()]),
        comments: None,
        copyright: Some("zitiger".to_string()),
        license: Some("MIT".to_string()),
        website: None,
        website_label: None,
        credits: None,
        icon: None,//Some(Icon::new("path/to/icon.png")),
    };

    app_menu.append_items(&[
        &PredefinedMenuItem::about(app_handle, Some("About"), Some(about_metadata)),
        &PredefinedMenuItem::separator(app_handle),
        &PredefinedMenuItem::services(app_handle, Some("Services")),
        &PredefinedMenuItem::separator(app_handle),
        &PredefinedMenuItem::hide(app_handle, Some("Hide")),
        &PredefinedMenuItem::hide_others(app_handle, Some("Hide Others")),
        &PredefinedMenuItem::show_all(app_handle, Some("Show All")),
        &PredefinedMenuItem::separator(app_handle),
        &PredefinedMenuItem::quit(app_handle, Some("Quit")),
    ]).expect("TODO: panic message");

    let file_menu = tauri::menu::SubmenuBuilder::with_id(app_handle, "file_menu", "&File").build()?;


    let create_file = MenuItem::with_id(app_handle, "create_file", "Create File", true, Some("CmdOrControl+N"));
    let create_folder = MenuItem::with_id(app_handle, "create_folder", "Create Folder", true, Some("CmdOrControl+R"));
    let open_file = MenuItem::with_id(app_handle, "open_file", "Open File", true, Some("CmdOrControl+O"));
    let open_folder = MenuItem::with_id(app_handle, "open_folder", "Open Folder", true, Some("CmdOrControl+D"));


    let save_file = MenuItem::with_id(app_handle, "save_file", "Save File", true, Some("CmdOrControl+S"));
    let save_as = MenuItem::with_id(app_handle, "save_as", "Save As", true, Some("CmdOrControl+Shift+S"));
    let save_all = MenuItem::with_id(app_handle, "save_all", "Save All", true, Some("CmdOrControl+Option+S"));
    let close_file = MenuItem::with_id(app_handle, "close_file", "Close File", true, Some("CmdOrControl+W"));
    let close_all = MenuItem::with_id(app_handle, "close_all", "Close All", true, Some("CmdOrControl+W"));


    file_menu.append_items(&[
        &create_file,
        &create_folder,
        &PredefinedMenuItem::separator(app_handle),
        &open_file,
        &open_folder,
        &PredefinedMenuItem::separator(app_handle),
        &save_file,
        &save_as,
        &save_all,
        &PredefinedMenuItem::separator(app_handle),
        &close_file,
        &close_all,
        &PredefinedMenuItem::separator(app_handle),
    ]).expect("xxx ");


    let more_recent = MenuItem::with_id(app_handle, "more_recent", "More", true, None);
    let clear_recent = MenuItem::with_id(app_handle, "clear_recent", "Clear", true, None);

    let recent_menu = tauri::menu::SubmenuBuilder::with_id(app_handle, "recent_menu", "Open Recent").build()?;
    recent_menu.append_items(&[
        &more_recent,
        &clear_recent,
        &PredefinedMenuItem::separator(app_handle)
    ]).expect("TODO: panic message");

    for i in 0..=9 {
        let open_recent_id = format!("open_recent_{}", i);
        let open_folder_item = MenuItem::with_id(app_handle, open_recent_id, "-", true, None);
        recent_menu.append(&open_folder_item).expect("TODO: panic message");
    }

    file_menu.append(&recent_menu).expect("TODO: panic message");

    let edit_menu = tauri::menu::SubmenuBuilder::with_id(app_handle, "edit_menu", "&Edit").build()?;
    edit_menu.append_items(&[
        &PredefinedMenuItem::undo(app_handle, Some("Undo")),
        &PredefinedMenuItem::redo(app_handle, Some("Redo")),
        &PredefinedMenuItem::separator(app_handle),
        &PredefinedMenuItem::cut(app_handle, Some("Cut")),
        &PredefinedMenuItem::copy(app_handle, Some("Copy")),
        &PredefinedMenuItem::paste(app_handle, Some("Paste")),
        &PredefinedMenuItem::select_all(app_handle, Some("Select All")),
    ]).expect("TODO: panic message");


    let theme_auto = CheckMenuItem::with_id(app_handle, "theme_auto", "Auto", true, false, None);//.accelerator("CmdOrControl+O");
    let theme_dark = CheckMenuItem::with_id(app_handle, "theme_dark", "Dark", true, false, None);//.accelerator("CmdOrControl+O");
    let theme_light = CheckMenuItem::with_id(app_handle, "theme_light", "Light", true, false, None);//.accelerator("CmdOrControl+O");

    let theme_menu = tauri::menu::SubmenuBuilder::with_id(app_handle, "theme_menu", "&Theme").build()?;
    theme_menu.append_items(&[
        &theme_auto,
        &theme_dark,
        &theme_light
    ]).expect("TODO: panic message");

    let locale_zh_cn = CheckMenuItem::with_id(app_handle, "locale_zh_cn", "中文", true, false, None);//.accelerator("CmdOrControl+O");
    let locale_en_us = CheckMenuItem::with_id(app_handle, "locale_en_us", "English", true, false, None);//.accelerator("CmdOrControl+O");
    let locale_menu = tauri::menu::SubmenuBuilder::with_id(app_handle, "locale_menu", "&Locale").build()?;
    locale_menu.append_items(&[
        &locale_zh_cn,
        &locale_en_us
    ]).expect("TODO: panic message");

    let mode_wysiwyg = CheckMenuItem::with_id(app_handle, "mode_wysiwyg", "WYSIWYG", true, false, None);//.accelerator("CmdOrControl+O");
    let mode_ir = CheckMenuItem::with_id(app_handle, "mode_ir", "Instant Rendering", true, false, None);//.accelerator("CmdOrControl+O");
    let mode_sv = CheckMenuItem::with_id(app_handle, "mode_sv", "Split View", true, false, None);//.accelerator("CmdOrControl+O");
    let mode_fullscreen = CheckMenuItem::with_id(app_handle, "mode_fullscreen", "Toggle Full Screen", true, false, None);//.accelerator("CmdOrControl+O");
    let mode_menu = tauri::menu::SubmenuBuilder::with_id(app_handle, "mode_menu", "&Mode").build()?;
    mode_menu.append_items(&[
        &mode_wysiwyg,
        &mode_ir,
        &mode_sv,
        &mode_fullscreen
    ]).expect("TODO: panic message");

    let menu = Menu::with_items(
        app_handle,
        &[
            &app_menu,
            &file_menu,
            &edit_menu,
            &theme_menu,
            &locale_menu,
            &mode_menu
        ])?;


    app_handle.on_menu_event(|app, event| {
        let menu_id = event.id.as_ref();

        if app.get_focused_window().is_some() {
            app.get_focused_window().unwrap().emit("top_menu_event", menu_id).expect("test");
        }
        // 自定义菜单的点击事件
        println!("你刚才点击了:{:?}", menu_id);
    });

    Ok(menu)
}

#[tauri::command]
pub fn set_menu_selected(window: tauri::Window, menu_id: String, selected: bool) {
    let menu_bar = window.app_handle().menu().unwrap();
    let submenus = menu_bar.items().unwrap();

    for submenu in submenus {
        let item = submenu.as_submenu().unwrap().get(&menu_id);
        if item.is_some() {
            println!("item{:?},{:?},{:?}", submenu.id(), menu_id, selected);

            if item.unwrap().as_check_menuitem().is_some() {
                submenu.as_submenu().unwrap().get(&menu_id).unwrap().as_check_menuitem().unwrap().set_checked(selected).expect("TODO: panic message");
            }
        }
    }
}


#[tauri::command]
pub fn set_menu_text<R: tauri::Runtime>(window: tauri::Window<R>, menu_id: String, text_array: Vec<String>) {
    if text_array.len() == 0 {
        return;
    }

    let menu_bar = window.app_handle().menu().unwrap();

    let mut submenu_option = menu_bar.get(&menu_id);
    if menu_id == "recent_menu" {
        submenu_option = menu_bar.get("file_menu").unwrap().as_submenu().unwrap().get("recent_menu");
    }

    if submenu_option.clone().unwrap().as_submenu().is_some() {
        println!("3");

        let menu_item_kind = submenu_option.unwrap();
        let submenu = menu_item_kind.as_submenu().unwrap();

        submenu.set_text(text_array.get(0).unwrap()).expect("TODO: panic message");

        println!("lll==={:?}", text_array.get(0).unwrap());

        update_text(submenu, text_array);
    }
}

pub fn update_text<R: tauri::Runtime>(submenu: &Submenu<R>, text_array: Vec<String>) {
    let mut text_index = 1;
    for menu_item in submenu.items().unwrap().iter().enumerate() {
        if text_index >= text_array.len() {
            break;
        }

        let common_menu_item = menu_item.as_menuitem();
        let submenu_item = menu_item.as_submenu();
        let predefined_item = menu_item.as_predefined_menuitem();
        let check_item = menu_item.as_check_menuitem();

        let text = text_array.get(text_index).unwrap();
        if common_menu_item.is_some() {
            common_menu_item.unwrap().set_text(text).expect("TODO: panic message");
            text_index += 1;
        } else if submenu_item.is_some() {
            submenu_item.unwrap().set_text(text).expect("TODO: panic message");
            text_index += 1;
        } else if predefined_item.is_some() {
            predefined_item.unwrap().set_text(text).expect("TODO: panic message");
            text_index += 1;
        } else if check_item.is_some() {
            check_item.unwrap().set_text(text).expect("TODO: panic message");
            text_index += 1;
        }
    }
}

#[tauri::command]
pub fn change_recent_menu<R: tauri::Runtime>(window: tauri::Window<R>, filepath_array: Vec<String>) {
    println!("change_recent_menu");
    let menu_bar = window.app_handle().menu().unwrap();

    let submenu_file = menu_bar.get("file_menu").unwrap();
    if submenu_file.as_submenu().is_some() {
        let recent_menu_option = submenu_file.as_submenu().unwrap().get("recent_menu");
        let recent_menu_item = recent_menu_option.unwrap();
        let recent_menu = recent_menu_item.as_submenu().unwrap();
        for i in 0..=9 {
            let open_recent_id = format!("open_recent_{}", i);

            let mut text = "-";
            if i < filepath_array.len() {
                text = filepath_array.get(filepath_array.len() - 1 - i).unwrap().as_str();
            }
            let file_item = recent_menu.get(open_recent_id.as_str()).unwrap();
            file_item.as_menuitem().unwrap().set_text(text).expect("TODO: panic message");
        }
    }
}
