import axios from "axios";

export default {
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
        isInit: state => !!state.displayName && !!state.role,
        isAdmin: state => state.role === 'ADMIN',
        isManager: state => state.role === 'MANAGER',
        isStaff: state => state.role === 'STAFF',
        displayName: state => state.displayName
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
                commit('REQUEST');
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