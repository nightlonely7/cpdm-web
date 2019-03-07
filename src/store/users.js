export default {
    namespaced: true,
    state: {
        users: []
    },
    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        },
    }
};