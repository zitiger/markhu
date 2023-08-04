import {createI18n} from 'vue-i18n'
import en from './en.json'
import zh from './zh_cn.json'
import {changeMenuTitle} from "../api/file";

// 获取浏览器界面语言，默认语言
// https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/language
let currentLanguage = navigator.language.replace('-', '_').toLowerCase()

// 如果本地缓存记录了语言环境，则使用本地缓存
let lsLocale = localStorage.getItem('locale') || ''
if (lsLocale) {
    currentLanguage = JSON.parse(lsLocale)?.curLocale
}

export const langs = {
    zh_cn: zh,
    en
}

const i18n = createI18n({
    locale: currentLanguage,
    fallbackLocale: "en",
    legacy: false, // 修复组件引入i18n时vite脚手架报错的问题
    globalInjection: true, // 全局注册 $t
    messages: langs
})

export default i18n;

export async function changeLocale(lang: string) {

    // @ts-ignore
    i18n.global.locale.value = lang

    const langMap = new Map(Object.entries(langs));
    const langJson = langMap.get(lang);
    if (langJson == null) {
        return
    }

    const menuJson = langJson.menu;
    const menuMap = new Map(Object.entries(menuJson));

    const convertedMap = convertKeysToSnakeCase(menuMap)

    convertedMap.forEach((value, key) => {
        changeMenuTitle(key, value);
        // console.log(`Key: ${key}, Value: ${value}`);
    });
}


function convertKeysToSnakeCase(map: Map<string, any>): Map<string, any> {
    const convertedMap = new Map<string, any>();

    for (const [key, value] of map.entries()) {
        const snakeCaseKey = key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
        convertedMap.set(snakeCaseKey, value);
    }

    return convertedMap;
}
