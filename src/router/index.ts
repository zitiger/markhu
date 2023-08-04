import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
// 定义路由组件路径
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import(`../components/views/Resource.vue`),
    },
    {
        path: '/outline',
        component: () => import(`../components/views/Outline.vue`),
    },
    {
        path: '/search',
        component: () => import(`../components/views/Search.vue`),
    },
];
// 创建Router对象
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
// 导出对象
export default router;
