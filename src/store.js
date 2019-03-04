import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLogged: false,
        showForm: false,
        titleSearchValue: '',
        summarySearchValue: '',
        task: {
            creator: {},
            executor: {},
        },
        tasks: [],
        taskForm: {
            executor: {},
        },
    },
    mutations: {
        SET_IS_LOGGED(state, isLogged) {
            state.isLogged = isLogged
        },
        SET_TASK(state, task) {
            state.task = task
        },
        SET_TASKS(state, tasks) {
            state.tasks = tasks
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
        }
    },
    actions: {}
})
