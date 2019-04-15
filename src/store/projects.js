const projectStoreDefaultState = () => {
    return {
        showForm: false,
        projects: [],
        projectForm: {},
        isEdit: true,
        titleSearchValue: '',
        summarySearchValue: '',
        currentProject: {},
        projectName: '',
        projectAlias: '',
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
        SET_PROJECTS(state, projects){
            state.projects = projects;
        },
        SET_CURRENT_PROJECT(state, currentProject){
            state.currentProject = currentProject;
        },
        SET_SHOW_FORM(state, showForm) {
            state.showForm = showForm;
        },
        SET_PROJECT_FORM(state, projectForm){
            state.projectForm = projectForm;
        },
        SET_IS_EDIT(state, isEdit){
            state.isEdit = isEdit;
        },
        SET_PROJECT_NAME(state, projectName){
            state.projectName = projectName;
        },
        SET_PROJECT_ALIAS(state, projectAlias){
            state.projectAlias = projectAlias;
        },
    }
};
