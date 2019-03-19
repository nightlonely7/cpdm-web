const taskStoreDefaultState = () => {
    return {
        showForm: false,
        showIssueForm: false,
        showRelativeForm: false,
        titleSearchValue: '',
        summarySearchValue: '',
        taskForm: {
            project: {},
            executor: {},
        },
        taskIssueForm: {},
        taskId: 0,
    }
};

export default {
    namespaced: true,
    state: taskStoreDefaultState(),
    mutations: {
        SET_TASK_FORM(state, taskForm) {
            Object.assign(state.taskForm, taskForm);
        },
        SET_TASK_ISSUE_FORM(state, taskIssueForm) {
            state.taskIssueForm = taskIssueForm
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
        SET_SHOW_ISSUE_FORM(state, showIssueForm) {
            state.showIssueForm = showIssueForm
        },
        SET_SHOW_RELATIVE_FORM(state, showRelativeForm) {
            state.showRelativeForm = showRelativeForm
        },
        SET_TASK_ID(state, taskId) {
            state.taskId = taskId
        },
        RESET(state) {
            state = Object.assign(state, taskStoreDefaultState());
        }
    },
    actions: {}
};