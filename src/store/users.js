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
        currentUser: {}
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
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue;
        },
        SET_CURRENT_USER(state, currentUser) {
            state.currentUser = currentUser;
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue;
        },
    }
};