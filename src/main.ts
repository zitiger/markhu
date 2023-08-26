import {createApp} from "vue";

import "./styles.css";
import App from "./App.vue";
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router';
import i18n from './locales'
import 'ant-design-vue/dist/reset.css';
import Antd from 'ant-design-vue';
import {createFromIconfontCN} from '@ant-design/icons-vue';

const app = createApp(App)

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia)

app.use(router)

app.use(i18n)

app.use(Antd);


const IconFont = createFromIconfontCN({
    scriptUrl: '/iconfont.js',// 在 iconfont.cn 上生成
    extraCommonProps: {"class": "icon-button"}
});
app.component('IconFont', IconFont);


app.mount('#app')
