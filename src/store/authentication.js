import axios from "axios";
import {mes, db} from "@/firebase.js";
import 'vuex';

var firebaseToken = '';
export default {
    namespaced: true,
    state: {
        id: 0,
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
        INIT(state, {id, displayName, role}) {
            state.id = id;
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
                var id = this.state.AUTHENTICATION.id;
                db.ref('users/' + id).once('value').then(function (snapshot) {
                    var list = [];
                    if (snapshot.val() != null) {
                        list = snapshot.val();
                    }

                    for (var i in list) {
                        if (list[i] === firebaseToken) {
                            console.log(i);
                            list.splice(i, 1);
                            db.ref("users/" + id).set(list);
                            break;
                        }
                    }
                });
                mes.deleteToken(firebaseToken).then(() => console.log('firebase token deleted'));
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
                        const id = response.data.id;
                        const displayName = response.data.displayName;
                        const role = response.data.role.name.replace('ROLE_', '');
                        commit('INIT', {id, displayName, role});
                        //
                        mes.requestPermission().then(function () {
                            console.log("Granted");
                            mes.getToken().then(function (token) {
                                console.log(token);
                                firebaseToken = token;
                                db.ref('users/' + id).once('value').then(function (snapshot) {
                                    var list = [];
                                    if (snapshot.val() != null) {
                                        list = snapshot.val();
                                    }
                                    var checked = true;
                                    for (var i in list) {
                                        if (list[i] === token) {
                                            checked = false;
                                        }
                                    }
                                    if (checked) {
                                        list.push(token);
                                    }
                                    db.ref("users/" + id).set(list)
                                        .then(() => resolve(response)
                                        );
                                });
                            }).catch((error) =>
                                console.log("Get token fail " + error)
                            );
                        }).catch(() =>
                            console.log("Grant fail")
                        );
                    })
                    .catch(error => {
                        commit('ERROR');
                        reject(error);
                    })
            })
        }
    }
};