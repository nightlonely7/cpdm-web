const taskStoreDefaultState = () => {
    return {
        showForm: false,
        titleSearchValue: '',
        summarySearchValue: '',
        task: {
            creator: {},
            executor: {},
        },
        creatorTasks: [],
        executorTasks: [],
        taskForm: {
            executor: {},
        },
    }
};

export default {
    namespaced: true,
    state: taskStoreDefaultState(),
    mutations: {
        SET_TASK(state, task) {
            state.task = task
        },
        SET_CREATOR_TASKS(state, creatorTasks) {
            state.creatorTasks = creatorTasks
        },
        SET_EXECUTOR_TASKS(state, executorTasks) {
            state.executorTasks = executorTasks
        },
        SET_TASK_FORM(state, taskForm) {
            state.taskForm = taskForm
        },
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue
        },
        SET_SHOW_FORM(state, showForm) {
            state.showForm = showForm
        },
        RESET(state) {
            state = Object.assign(state, taskStoreDefaultState());
        }
    },
    actions: {}
};