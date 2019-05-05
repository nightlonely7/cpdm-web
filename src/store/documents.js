const documentStoreDefaultState = () => {
    return {
        titleSearchValue: '',
        summarySearchValue: '',
        createdTimeFromSearchValue: null,
        createdTimeToSearchValue: null,
        startTimeFromSearchValue: null,
        startTimeToSearchValue: null,
        endTimeFromSearchValue: null,
        endTimeToSearchValue: null,
    }
};

export default {
    namespaced: true,
    state: documentStoreDefaultState(),
    mutations: {
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue
        },
        SET_CREATED_TIME_FROM_SEARCH_VALUE(state, createdTimeFromSearchValue) {
            state.createdTimeFromSearchValue = createdTimeFromSearchValue
        },
        SET_CREATED_TIME_TO_SEARCH_VALUE(state, createdTimeToSearchValue) {
            state.createdTimeToSearchValue = createdTimeToSearchValue
        },
        SET_START_TIME_FROM_SEARCH_VALUE(state, startTimeFromSearchValue) {
            state.startTimeFromSearchValue = startTimeFromSearchValue
        },
        SET_START_TIME_TO_SEARCH_VALUE(state, startTimeToSearchValue) {
            state.startTimeToSearchValue = startTimeToSearchValue
        },
        SET_END_TIME_FROM_SEARCH_VALUE(state, endTimeFromSearchValue) {
            state.endTimeFromSearchValue = endTimeFromSearchValue
        },
        SET_END_TIME_TO_SEARCH_VALUE(state, endTimeToSearchValue) {
            state.endTimeToSearchValue = endTimeToSearchValue
        },
        RESET(state) {
            state = Object.assign(state, documentStoreDefaultState());
        }
    }
};
