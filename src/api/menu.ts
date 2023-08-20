import {changeRecentMenu, listenMenuEvent, setMenuSelected, setMenuText} from "./file";
import {useDialogStore, useEditorStore, useSystemStore} from "../stores";
import {watch} from "vue";
import i18n, {langs} from "../locales";

export async function initMenu() {

    await listenMenuEvent({
        'open_file': () => useEditorStore().open(),
        'open_folder': () => useSystemStore().open(),
        'create_file': () => useDialogStore().showCreateFileDialog(),
        'create_folder': () => useDialogStore().showCreateDirDialog(),
        'save_file': () => useEditorStore().save(useEditorStore().activeFile),
        'save_as': () => useDialogStore().showSaveAsDialog(),
        'save_all': () => useEditorStore().saveAll(),
        'close_file': () => useEditorStore().close(useEditorStore().activeFile),
        'close_all': () => useEditorStore().closeAll(),
        'theme_auto': () => useSystemStore().changeTheme('auto'),
        'theme_dark': () => useSystemStore().changeTheme('dark'),
        'theme_light': () => useSystemStore().changeTheme('light'),
        'locale_zh_cn': () => useSystemStore().setLocale("zh_CN"),
        'locale_en_us': () => useSystemStore().setLocale("en_US"),
        'mode_wysiwyg': () => useEditorStore().editMode = 'wysiwyg',
        'mode_ir': () => useEditorStore().editMode = 'ir',
        'mode_sv': () => useEditorStore().editMode = 'sv',
        'mode_zen': () => useEditorStore().toggleZenMode(),
        'open_recent_0': () => useEditorStore().readHistory(0),
        'open_recent_1': () => useEditorStore().readHistory(1),
        'open_recent_2': () => useEditorStore().readHistory(2),
        'open_recent_3': () => useEditorStore().readHistory(3),
        'open_recent_4': () => useEditorStore().readHistory(4),
        'open_recent_5': () => useEditorStore().readHistory(5),
        'open_recent_6': () => useEditorStore().readHistory(6),
        'open_recent_7': () => useEditorStore().readHistory(7),
        'open_recent_8': () => useEditorStore().readHistory(8),
        'open_recent_9': () => useEditorStore().readHistory(9),
        'more_recent': () => useDialogStore().showHistoryFileDialog(),
        'clear_recent': () => useSystemStore().clearHistory(),
    });

    watch(() => useSystemStore().theme, async (newValue, oldValue) => {
        if (oldValue) {
            await setMenuSelected("theme_" + oldValue, false)
        }
        await setMenuSelected("theme_" + newValue, true)
    }, {immediate: true});

    watch(() => useSystemStore().locale, async (newValue, oldValue) => {
        if (oldValue) {
            await setMenuSelected("locale_" + oldValue.toLowerCase(), false)
        }
        await setMenuSelected("locale_" + newValue.toLowerCase(), true)

        await changeLocale(newValue);
    }, {immediate: true});

    watch(() => useEditorStore().editMode, async (newValue, oldValue) => {
        if (oldValue) {
            await setMenuSelected("mode_" + oldValue, false)
        }
        await setMenuSelected("mode_" + newValue, true)
    }, {immediate: true});

    watch(() => useEditorStore().zenMode, async (newValue, oldValue) => {
        await setMenuSelected("mode_zen", newValue)
    }, {immediate: true});

    watch(() => useSystemStore().history, async (newValue, oldValue) => {

        await changeRecentMenu(newValue);

    }, {immediate: true, deep: true});
}


export async function changeLocale(lang: string) {

    localStorage.setItem("locale", lang)

    // @ts-ignore
    i18n.global.locale.value = lang

    const langMap = new Map(Object.entries(langs));
    const langJson = langMap.get(lang);
    if (langJson == null) {
        return
    }

    const menuJson = langJson.menu;
    for (let menuJsonKey in menuJson) {
        // @ts-ignore
        await setMenuText(menuJsonKey, menuJson[menuJsonKey]);
    }
}
