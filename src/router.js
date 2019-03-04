import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
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
            name: 'Quản lý tác vụ',
            component: () => import('@/views/tasks/TaskDetailPage.vue')
        }
    ]
})
