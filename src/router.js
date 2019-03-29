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
            path: '/documents',
            name: 'Quản lý tài liệu',
            component: () => import('@/views/documents/DocumentPage.vue')
        },
        {
            path: '/tasks',
            name: 'Quản lý tác vụ',
            component: () => import('@/views/tasks/TaskPage.vue')
        },
        {
            path: '/tasks/:id',
            name: 'Chi tiết tác vụ',
            props: (route) => {
                const id = Number.parseInt(route.params.id);
                if (Number.isNaN(id)) {
                    return 0;
                }
                return {id};
            },
            component: () => import('@/views/tasks/TaskDetailPage.vue')
        },
        {
            path: '/users',
            name: 'Quản lý nhân viên',
            component: () => import('@/views/users/UserPage.vue')
        },
        {
            path: '/users/:id',
            name: 'Quản lý nhân viên',
            component: () => import('@/views/users/UserDetailPage.vue')
        },
        {
            path: '/self',
            name: 'Quản lý thông tin cá nhân',
            component: () => import('@/views/users/UserPersonal.vue')
        },
        {
            path: '/userLeaveRequests',
            name: 'Quản lý đơn xin nghỉ phép',
            component: () => import('@/views/leaveRequests/UserLeaveRequestPage.vue')
        },
        {
            path: '/approverLeaveRequests',
            name: 'Xét duyệt đơn xin nghỉ phép',
            component: () => import('@/views/leaveRequests/ApproverLeaveRequestPage.vue')
        },
        {
            path: '/viewLeaveCalendar',
            name: 'Lịch nghỉ phép',
            component: () => import('@/views/leaveRequests/viewLeaveCalendarPage.vue')
        },
        {
            path: '/viewUserLeaves',
            name: 'Theo dõi nghỉ phép',
            component: () => import('@/views/leaveRequests/viewUserLeavePage.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {

    if (to.path === '/login') {
        if (store.getters['AUTHENTICATION/isLoggedIn']) {
            store.dispatch('AUTHENTICATION/INIT')
                .then(() => next('/tasks'))
                .catch(() => next('/login'));
            return;
        }
        next();
        return;
    }
    if (!store.getters['AUTHENTICATION/isLoggedIn']) {
        next('/login');
        return;
    }
    if (!store.getters['AUTHENTICATION/isInit']) {
        store.dispatch('AUTHENTICATION/INIT')
            .then(() => next())
            .catch(() => next('/login'));
        return;
    }
    console.log('router');
    next();
});

export default router;




