import {defineStore} from 'pinia'
import {ref} from 'vue'
import {useStructureStore} from "./structure";
import i18n from "../../locales";
import {getTheme, openFolderApi} from "../../api/file";
import path from "../../api/path";

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
            const folder = await openFolderApi();
            if (folder.length > 0) {
                this.workspace = folder;
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
