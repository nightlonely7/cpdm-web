const askingRequestStoreDefaultState = () => {
    return {
        selectedTasks : [],
    }
};

export default {
    namespaced: true,
    state: askingRequestStoreDefaultState(),
    mutations: {
        SET_SELECTED_TASK(state, selectedTasks){
          state.selectedTasks = selectedTasks;
        },
        RESET(state) {
            state = Object.assign(state, askingRequestStoreDefaultState());
        }
    }
};