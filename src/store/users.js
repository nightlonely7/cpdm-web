const userStoreDefaultState = () => {
    return {
        emailSearchValue: '',
        displayNameSearchValue: '',
        fullNameSearchValue: '',
        departmentId: '',
        birthDateTo: '',
        birthDateFrom: '',
        gender: ''
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
        SET_DEPARTMENT_ID_VALUE(state, departmentId) {
            state.departmentId = departmentId;
        },
        SET_BIRTH_DATE_TO_VALUE(state, birthDateTo) {
            state.birthDateTo = birthDateTo;
        },
        SET_BIRTH_DATE_FROM_VALUE(state, birthDateFrom) {
            state.birthDateFrom = birthDateFrom;
        },
        SET_GENDER_VALUE(state, gender) {
            state.gender = gender;
        },
    }
};