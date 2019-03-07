import Vue from 'vue';
import Vuex from 'vuex';
import AUTHENTICATION from '@/store/authentication.js';
import TASK_STORE from '@/store/tasks.js';
import USER_STORE from '@/store/users.js';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        TASK_STORE,
        AUTHENTICATION,
        USER_STORE
    }
})
