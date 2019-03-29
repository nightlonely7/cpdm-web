const commentStoreDefaultState = () => {
    return {
        comments: {}
    }
};

export default {
    namespaced: true,
    state: commentStoreDefaultState(),
    mutations: {
        SET_COMMENT(state, comments) {
            state.comments = comments
        },
        RESET(state) {
            state = Object.assign(state, commentStoreDefaultState());
        }
    },
    actions: {}
};