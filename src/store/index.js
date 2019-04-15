import Vue from 'vue';
import Vuex from 'vuex';
import AUTHENTICATION from '@/store/authentication.js';
import DEPARTMENT_STORE from '@/store/departments.js';
import PROJECT_STORE from '@/store/projects.js';
import DOCUMENT_STORE from '@/store/documents.js';
import TASK_STORE from '@/store/tasks.js';
import USER_STORE from '@/store/users.js';
import ASSIGN_REQUEST_STORE from '@/store/assignRequest.js'
import ASKING_REQUEST_STORE from '@/store/askingRequest.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        DEPARTMENT_STORE,
        PROJECT_STORE,
        DOCUMENT_STORE,
        TASK_STORE,
        AUTHENTICATION,
        USER_STORE,
        ASSIGN_REQUEST_STORE,
        ASKING_REQUEST_STORE,
    }
})
