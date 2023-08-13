import {createI18n} from 'vue-i18n'
import en_US from './en_US.json'
import zh_CN from './zh_CN.json'
import {changeMenuTitle} from "../api/file";

// 获取浏览器界面语言，默认语言
// https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/language
let currentLanguage = navigator.language.replace('-', '_')
if(currentLanguage === "en"){
    currentLanguage="en_US"
}
else if(currentLanguage === "ja"){
    currentLanguage="ja_JP"
}

// 如果本地缓存记录了语言环境，则使用本地缓存
let savedLocale = localStorage.getItem('locale') || ''
if (savedLocale) {
    currentLanguage = savedLocale
}

export const langs = {
    zh_CN,
    en_US
}

const i18n = createI18n({
    locale: currentLanguage,
    fallbackLocale: "en",
    legacy: false, // 修复组件引入i18n时vite脚手架报错的问题
    globalInjection: true, // 全局注册 $t
    messages: langs
})

export default i18n;
