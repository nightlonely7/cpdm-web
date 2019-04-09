const assignRequestStoreDefaultState = () => {
    return {
        selectedTasks : [],
    }
};

export default {
    namespaced: true,
    state: assignRequestStoreDefaultState(),
    mutations: {
        SET_SELECTED_TASK(state, selectedTasks){
          state.selectedTasks = selectedTasks;
        },
        RESET(state) {
            state = Object.assign(state, assignRequestStoreDefaultState());
        }
    }
};