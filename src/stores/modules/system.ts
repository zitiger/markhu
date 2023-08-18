import {defineStore} from 'pinia'
import {ref} from 'vue'
import {open} from '@tauri-apps/plugin-dialog';
import {useStructureStore} from "./structure";
import path from 'path-browserify';
import i18n from "../../locales";
import {getCurrent} from "@tauri-apps/plugin-window";
import {getTheme} from "../../api/file";

export const useSystemStore = defineStore('system', {
    persist: true,
    state: () => {
        const workspace = ref<string>('') //
        const locale = ref(i18n.global.locale.value)
        const theme = ref('dark')
        const realTheme = ref('dark')

        const history = ref<string[]>([])

        return {workspace, locale, theme, realTheme, history}
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
            // await changeLocale(lang)
        },

        async changeTheme(theme: string) {
            let realTheme = theme;
            if (theme === 'auto') {
                console.log("ddddd1")

                let systemTheme = await getTheme();//await getCurrent().theme()
                console.log("ddddd2")
                if (systemTheme == null) {
                    realTheme = "dark";
                } else {
                    realTheme = systemTheme;
                }
            }

            this.theme = theme;
            this.realTheme = realTheme
        },
        async addHistory(filepath: string) {
            if (this.history.includes(filepath)) {
                const index = this.history.indexOf(filepath);
                if (index !== -1) {
                    this.history.splice(index, 1);
                }
            }
            this.history.push(filepath);

            while (this.history.length > 50) {
                this.history.shift();
            }
        },
        async clearHistory() {
            this.history.length = 0;
        }
    }
})
