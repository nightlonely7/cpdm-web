const leaveRequestStoreDefaultState = () => {
    return {
    }
};

export default {
    namespaced: true,
    state: leaveRequestStoreDefaultState(),
    mutations: {
        RESET(state) {
            state = Object.assign(state, leaveRequestStoreDefaultState());
        }
    },
    actions: {}
};