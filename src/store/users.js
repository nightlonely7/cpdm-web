const userStoreDefaultState = () => {
    return {
        showForm: false,
        titleSearchValue: '',
        summarySearchValue: '',
        users: [],
        userForm: {
            department: {},
            role: {},
        },
    }
};

export default {
    namespaced: true,
    state: userStoreDefaultState(),
    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        },
        SET_SHOW_FORM(state, showForm) {
            state.showForm = showForm;
        },
        SET_USER_FORM(state, userForm) {
            state.userForm = userForm;
        },
    }
};