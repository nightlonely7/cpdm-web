const taskStoreDefaultState = () => {
    return {
        showForm: false,
        showIssueForm: false,
        showRelativeForm: false,
        titleSearchValue: null,
        summarySearchValue: null,
        descriptionSearchValue: null,
        createdTimeFromSearchValue: null,
        createdTimeToSearchValue: null,
        startTimeFromSearchValue: null,
        startTimeToSearchValue: null,
        endTimeFromSearchValue: null,
        endTimeToSearchValue: null,
        projectIdSearchValue: null,
        statusSearchValue: [],
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
        SET_TASK_ISSUE_FORM(state, taskIssueForm) {
            state.taskIssueForm = taskIssueForm
        },
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue
        },
        SET_DESCRIPTION_SEARCH_VALUE(state, descriptionSearchValue) {
            state.descriptionSearchValue = descriptionSearchValue
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
        SET_PROJECT_ID_SEARCH_VALUE(state, projectIdSearchValue) {
            state.projectIdSearchValue = projectIdSearchValue
        },
        SET_STATUS_SEARCH_VALUE(state, statusSearchValue) {
            state.statusSearchValue = statusSearchValue
        },
        RESET_SEARCH(state) {
            state.titleSearchValue = null;
            state.summarySearchValue = null;
            state.descriptionSearchValue = null;
            state.createdTimeFromSearchValue = null;
            state.createdTimeToSearchValue = null;
            state.startTimeFromSearchValue = null;
            state.startTimeToSearchValue = null;
            state.endTimeFromSearchValue = null;
            state.endTimeToSearchValue = null;
            state.projectIdSearchValue = null;
            state.statusSearchValue = [];
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