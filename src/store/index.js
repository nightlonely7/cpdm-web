import Vue from 'vue';
import Vuex from 'vuex';
import AUTHENTICATION from '@/store/authentication.js';
import TASK_STORE from '@/store/tasks.js';
import USER_STORE from '@/store/users.js';
import COMMENT_STORE from '@/store/comment.js';
import LEAVE_REQUEST_STORE from '@/store/leaveRequest.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        TASK_STORE,
        AUTHENTICATION,
        USER_STORE,
        COMMENT_STORE,
        LEAVE_REQUEST_STORE
    }
})
