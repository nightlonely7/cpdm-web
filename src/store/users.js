const userStoreDefaultState = () => {
    return {
        emailSearchValue: '',
        displayNameSearchValue: '',
        fullNameSearchValue: '',
    }
};

export default {
    namespaced: true,
    state: userStoreDefaultState(),
    mutations: {
        SET_EMAIL_SEARCH_VALUE(state, emailSearchValue) {
            state.emailSearchValue = emailSearchValue;
        },
        SET_DISPLAY_NAME_SEARCH_VALUE(state, displayNameSearchValue) {
            state.displayNameSearchValue = displayNameSearchValue;
        },
        SET_FULL_NAME_SEARCH_VALUE(state, fullNameSearchValue) {
            state.fullNameSearchValue = fullNameSearchValue;
        },
    }
};