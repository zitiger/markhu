import { createApp } from "vue";

import "./styles.css";
import App from "./App.vue";

const app = createApp(App)

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia)

import router from './router';
app.use(router)

import i18n from './locales'
app.use(i18n)

import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
app.use(Antd);


import { createFromIconfontCN } from '@ant-design/icons-vue';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_4193180_4c73ucwcax3.js', // 在 iconfont.cn 上生成
});
app.component('IconFont', IconFont);


app.mount('#app')
