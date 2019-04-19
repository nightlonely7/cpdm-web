const departmentStoreDefaultState = () => {
    return {
        departments: [],
        departmentForm: {},
        isEdit: true,
        departmentName: '',
        departmentAlias: '',
        currentDepartment: {},
        titleSearchValue: '',
        summarySearchValue: '',
    }
};

export default {
    namespaced: true,
    state: departmentStoreDefaultState(),
    mutations: {
        SET_DEPARTMENTS(state, departments){
            state.departments = departments;
        },
        SET_DEPARTMENT_FORM(state, departmentForm){
            state.departmentForm = departmentForm;
        },
        SET_IS_EDIT(state, isEdit){
            state.isEdit = isEdit;
        },
        SET_DEPARTMENT_NAME(state, departmentName){
            state.departmentName = departmentName;
        },
        SET_DEPARTMENT_ALIAS(state, departmentAlias){
            state.departmentAlias = departmentAlias;
        },
        SET_CURRENT_DEPARTMENT(state, currentDepartment){
            state.currentDepartment = currentDepartment;
        },
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue
        },
    }
};
