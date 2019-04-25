const departmentStoreDefaultState = () => {
    return {
        nameSearchValue: '',
        aliasSearchValue: '',
    }
};

export default {
    namespaced: true,
    state: departmentStoreDefaultState(),
    mutations: {
        SET_NAME_SEARCH_VALUE(state, nameSearchValue) {
            state.nameSearchValue = nameSearchValue
        },
        SET_ALIAS_SEARCH_VALUE(state, aliasSearchValue) {
            state.aliasSearchValue = aliasSearchValue
        },
    }
};
