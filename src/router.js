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
            path: '/departments',
            name: 'Quản lý phòng ban',
            component: () => import('@/views/departments/DepartmentPage.vue')
        },
        {
            path: '/departments/:id',
            name: 'Chi tiết phòng ban',
            props: (route) => {
                const id = Number.parseInt(route.params.id);
                if (Number.isNaN(id)) {
                    return 0;
                }
                return {id};
            },
            component: () => import('@/views/departments/DepartmentDetailPage.vue')
        },
        {
            path: '/projects',
            name: 'Quản lý dự án',
            component: () => import('@/views/projects/ProjectPage.vue')
        },
        {
            path: '/projects/:id',
            name: 'Chi tiết dự án',
            props: (route) => {
                const id = Number.parseInt(route.params.id);
                if (Number.isNaN(id)) {
                    return 0;
                }
                return {id};
            },
            component: () => import('@/views/projects/ProjectDetailPage.vue')
        },
        {
            path: '/documents',
            name: 'Quản lý tài liệu',
            component: () => import('@/views/documents/DocumentPage.vue')
        },
        {
            path: '/documents/:id',
            name: 'Chi tiết tài liệu',
            props: (route) => {
                const id = Number.parseInt(route.params.id);
                if (Number.isNaN(id)) {
                    return 0;
                }
                return {id};
            },
            component: () => import('@/views/documents/DocumentDetailPage.vue')
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
            name: 'Chi tiết nhân viên',
            props: (route) => {
                const id = Number.parseInt(route.params.id);
                if (Number.isNaN(id)) {
                    return 0;
                }
                return {id};
            },
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
            component: () => import('@/views/leaveRequests/ViewLeaveCalendarPage.vue')
        },
        {
            path: '/viewUserLeaves',
            name: 'Theo dõi nghỉ phép',
            component: () => import('@/views/leaveRequests/ViewUserLeavePage.vue')
        },
        {
            path: '/managePolicyForLeave',
            name: 'Quản lý chính sách nghỉ phép',
            component: () => import('@/views/leaveRequests/ManagePolicyForLeavePage.vue')
        },
        {
            path: '/createUserAssignRequests',
            name: 'Tạo đơn xin ủy quyền',
            component: () => import('@/views/assignRequests/CreatingUserAssignRequestPage.vue')
        },
        {
            path: '/userAssignRequests',
            name: 'Quản lý đơn xin ủy quyền',
            component: () => import('@/views/assignRequests/UserAssignRequestPage.vue')
        },
        {
            path: '/approverAssignRequests',
            name: 'Xét duyệt đơn xin ủy quyền',
            component: () => import('@/views/assignRequests/ApproverAssignRequestPage.vue')
        },
        ,
        {
            path: '/createAskingRequests',
            name: 'Xin ý kiến lãnh đạo',
            component: () => import('@/views/askingRequests/CreatingAskingRequestPage.vue')
        },
        {
            path: '/senderAskingRequests',
            name: 'Theo dõi',
            component: () => import('@/views/askingRequests/SenderAskingRequestPage.vue')
        },
        {
            path: '/receiverAskingRequests',
            name: 'Phản hồi',
            component: () => import('@/views/askingRequests/ReceiverAskingRequestPage.vue')
        },
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
    next();
});

export default router;




