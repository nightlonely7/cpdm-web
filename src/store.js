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
        authorities: []
    },
    mutations: {
        REQUEST(state) {
            state.status = 'loading';
        },
        SUCCESS(state, {token, displayName, authorities}) {
            state.status = 'success';
            state.token = token;
            state.displayName = displayName;
            state.authorities = authorities;
        },
        ERROR(state) {
            state.status = 'error';
        },
        LOGOUT(state) {
            state.status = '';
            state.token = '';
        }
    },
    getters: {
        isLoggedIn: state => !!state.token
    },
    actions: {
        LOGIN({commit}, user) {
            return new Promise((resolve, reject) => {
                commit('REQUEST');
                axios({url: 'http://localhost:8080/login', data: user, method: 'POST'})
                    .then(response => {
                        const token = response.data.token;
                        const displayName = response.data.displayName;
                        const authorities = response.data.authorities;
                        console.log(response.data);
                        localStorage.setItem('cpdm_token', token);
                        commit('SUCCESS', {token, displayName, authorities});
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
        }
    }
};

const TASK_STORE = {
    namespaced: true,
    state: {
        isLogged: false,
        showForm: false,
        titleSearchValue: '',
        summarySearchValue: '',
        task: {
            creator: {},
            executor: {},
        },
        tasks: [],
        taskForm: {
            executor: {},
        },
    },
    mutations: {
        SET_IS_LOGGED(state, isLogged) {
            state.isLogged = isLogged
        },
        SET_TASK(state, task) {
            state.task = task
        },
        SET_TASKS(state, tasks) {
            state.tasks = tasks
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
