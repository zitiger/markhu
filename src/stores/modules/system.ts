import {defineStore} from 'pinia'
import {ref} from 'vue'
import {open} from '@tauri-apps/api/dialog';
import {useStructureStore} from "./structure";
import path from 'path-browserify';
import i18n from "../../locales";
import {changeLocale} from "../../locales";
import {appWindow} from "@tauri-apps/api/window";

export const useSystemStore = defineStore('system', {
    persist: true,
    state: () => {
        const workspace = ref<string>('') //
        const locale = ref(i18n.global.locale.value)
        const theme = ref('dark')
        const realTheme = ref('dark')

        return {workspace, locale, theme, realTheme}
    },
    getters: {
        assertDir: (state) => path.join(state.workspace, "assets"),
    },
    actions: {
        async open() {
            const selected = await open({
                directory: true,
            });
            if (Array.isArray(selected)) {
                // user selected multiple directories
            } else if (selected === null) {
                // user cancelled the selection
            } else {
                this.workspace = selected;
                await useStructureStore().load();
            }
        },

        async setLocale(lang: any) {
            this.locale = lang
            await changeLocale(lang)
        },

        async changeTheme(theme: string) {
            let realTheme = theme;
            if (theme === 'auto') {
                let systemTheme = await appWindow.theme()
                if (systemTheme == null) {
                    realTheme = "dark";
                } else {
                    realTheme = systemTheme;
                }
            }

            this.theme = theme;
            this.realTheme = realTheme
        }
    }
})
