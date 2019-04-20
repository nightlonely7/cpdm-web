const projectStoreDefaultState = () => {
    return {
        titleSearchValue: '',
        summarySearchValue: '',
    }
};

export default {
    namespaced: true,
    state: projectStoreDefaultState(),
    mutations: {
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue
        },
    }
};
