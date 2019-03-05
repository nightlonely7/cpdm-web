import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);

const AUTHENTICATION = {
    namespaced: true,
    state: {
        status: '',
        token: localStorage.getItem('cpdm_token') || '',
        displayName: '',
        role: '',
    },
    mutations: {
        REQUEST(state) {
            state.status = 'loading';
        },
        SUCCESS(state, token) {
            state.status = 'success';
            state.token = token;
        },
        ERROR(state) {
            state.status = 'error';
        },
        LOGOUT(state) {
            state.status = '';
            state.token = '';
            state.displayName = '';
            state.role = '';
        },
        INIT(state, {displayName, role}) {
            state.status = 'success';
            state.displayName = displayName;
            state.role = role;
        }
    },
    getters: {
        isLoggedIn: state => !!state.token,
        isAdmin: state => state.role === 'ADMIN',
        isManager: state => state.role === 'MANAGER',
        isStaff: state => state.role === 'STAFF',
    },
    actions: {
        LOGIN({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('REQUEST');
                axios({url: 'http://localhost:8080/login', data: user, method: 'POST'})
                    .then(response => {
                        const token = response.data.token;
                        localStorage.setItem('cpdm_token', token);
                        commit('SUCCESS', token);
                        resolve(response);
                    })
                    .catch(error => {
                        commit('ERROR');
                        localStorage.removeItem('cpdm_token');
                        reject(error);
                    })
            })
        },
        LOGOUT({commit}) {
            return new Promise((resolve) => {
                commit('LOGOUT');
                localStorage.removeItem('cpdm_token');
                resolve()
            })
        },
        INIT({commit}) {
            return new Promise((resolve, reject) => {
                axios({url: 'http://localhost:8080/self', method: 'GET'})
                    .then(response => {
                        const displayName = response.data.displayName;
                        const role = response.data.role.name.replace('ROLE_', '');
                        commit('INIT', {displayName, role});
                        resolve(response);
                    })
                    .catch(error => {
                        commit('ERROR');
                        reject(error);
                    })
            })
        }
    }
};

const taskStoreDefaultState = () => {
    return {
        isLogged: false,
        showForm: false,
        titleSearchValue: '',
        summarySearchValue: '',
        task: {
            creator: {},
            executor: {},
        },
        creatorTasks: [],
        executorTasks: [],
        taskForm: {
            executor: {},
        },
    }
};

const TASK_STORE = {
    namespaced: true,
    state: taskStoreDefaultState(),
    mutations: {
        SET_IS_LOGGED(state, isLogged) {
            state.isLogged = isLogged
        },
        SET_TASK(state, task) {
            state.task = task
        },
        SET_CREATOR_TASKS(state, creatorTasks) {
            state.creatorTasks = creatorTasks
        },
        SET_EXECUTOR_TASKS(state, executorTasks) {
            state.executorTasks = executorTasks
        },
        SET_TASK_FORM(state, taskForm) {
            state.taskForm = taskForm
        },
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue
        },
        SET_SHOW_FORM(state, showForm) {
            state.showForm = showForm
        },
        RESET(state) {
            state = Object.assign(state, taskStoreDefaultState());
        }
    },
    actions: {}
};

export default new Vuex.Store({
    modules: {
        TASK_STORE,
        AUTHENTICATION
    }
})
