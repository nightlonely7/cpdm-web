const userStoreDefaultState = () => {
    return {
        showForm: false,
        emailSearchValue: '',
        displayNameSearchValue: '',
        fullNameSearchValue: '',
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
        SET_EMAIL_SEARCH_VALUE(state, emailSearchValue) {
            state.emailSearchValue = emailSearchValue;
        },
        SET_DISPLAY_NAME_SEARCH_VALUE(state, displayNameSearchValue) {
            state.displayNameSearchValue = displayNameSearchValue;
        },
        SET_FULL_NAME_SEARCH_VALUE(state, fullNameSearchValue) {
            state.fullNameSearchValue = fullNameSearchValue;
        },
        SET_CURRENT_USER(state, currentUser) {
            state.currentUser = currentUser;
        },
    }
};