import Vue from 'vue';
import Vuex from 'vuex';
import AUTHENTICATION from '@/store/authentication.js';
import TASK_STORE from '@/store/tasks.js';
import USER_STORE from '@/store/users.js';
import DEPARTMENT_STORE from '@/store/departments.js';
import PROJECT_STORE from '@/store/projects.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        TASK_STORE,
        AUTHENTICATION,
        USER_STORE,
        DEPARTMENT_STORE,
        PROJECT_STORE
    }
})
