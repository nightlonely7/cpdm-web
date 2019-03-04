import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'Đăng nhập',
            component: () => import('@/views/LoginPage.vue')
        },
        {
            path: '/tasks',
            name: 'Quản lý tác vụ',
            component: () => import('@/views/tasks/TaskPage.vue')
        },
        {
            path: '/tasks/:id',
            name: 'Chi tiết tác vụ',
            component: () => import('@/views/tasks/TaskDetailPage.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path === '/login' || store.getters['AUTHENTICATION/isLoggedIn']) {
        next();
        return;
    }
    next('/login');

});

export default router;




