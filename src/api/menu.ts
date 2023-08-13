import {changeMenuTitle, listenMenuEvent, setMenuSelected} from "./file";
import {useDialogStore, useEditorStore, useSystemStore} from "../stores";
import {watch} from "vue";

export async function initMenu() {

    await listenMenuEvent({
        'open_file': () => useEditorStore().open(),
        'open_folder': () => useSystemStore().open(),
        'create_file': () => useDialogStore().showCreateFileDialog(),
        'create_folder': () => useDialogStore().showCreateDirDialog(),
        'save_file': () => useEditorStore().save(useEditorStore().activeFile),
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
        'mode_fullscreen': () => useEditorStore().toggleFullscreenMode(),
        'history_file_0': () => useEditorStore().readHistory(0),
        'history_file_1': () => useEditorStore().readHistory(1),
        'history_file_2': () => useEditorStore().readHistory(2),
        'history_file_3': () => useEditorStore().readHistory(3),
        'history_file_4': () => useEditorStore().readHistory(4),
        'history_file_5': () => useEditorStore().readHistory(5),
        'history_file_6': () => useEditorStore().readHistory(6),
        'history_file_7': () => useEditorStore().readHistory(7),
        'history_file_8': () => useEditorStore().readHistory(8),
        'history_file_9': () => useEditorStore().readHistory(9),
        'more_history': () => useDialogStore().showHistoryFileDialog(),
        'clear_history': () => useSystemStore().clearHistory(),
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
    }, {immediate: true});

    watch(() => useEditorStore().editMode, async (newValue, oldValue) => {
        if (oldValue) {
            await setMenuSelected("mode_" + oldValue, false)
        }
        await setMenuSelected("mode_" + newValue, true)
    }, {immediate: true});

    watch(() => useEditorStore().fullscreenMode, async (newValue, oldValue) => {
        await setMenuSelected("mode_fullscreen", newValue)
    }, {immediate: true});

    watch(() => useSystemStore().history, async (newValue, oldValue) => {

        for (let i = 0; i < 10; i++) {
            let menuId = "history_file_" + i;

            if (i < newValue.length) {
                let filepath = newValue[newValue.length - 1 - i];
                await changeMenuTitle(menuId, filepath);
            } else {
                await changeMenuTitle(menuId, "--");
            }
        }
    }, {immediate: true, deep: true});
}
