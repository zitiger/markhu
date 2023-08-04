import {defineStore} from 'pinia'
import {ref} from 'vue'
import {open} from '@tauri-apps/api/dialog';
import {useStructureStore} from "./structure";
import path from 'path-browserify';
import i18n from "../../locales";
import {changeLocale} from "../../locales";

export const useSystemStore = defineStore('system', {
    persist: true,
    state: () => {
        const workspace = ref<string>('') //
        // const assertDir = ref<string>() //
        const locale = ref(i18n.global.locale.value)

        return {workspace, locale}
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
        }
    }
})
