const departmentStoreDefaultState = () => {
    return {
        showForm: false,
        departments: [],
        departmentForm: {},
        isEdit: true
    }
};

export default {
    namespaced: true,
    state: departmentStoreDefaultState(),
    mutations: {
        SET_DEPARTMENTS(state, departments){
            state.departments = departments;
        },
        SET_SHOW_FORM (state, showForm) {
            state.showForm = showForm;
        },
        SET_DEPARTMENT_FORM(state, departmentForm){
            state.departmentForm = departmentForm;
        },
        SET_IS_EDIT(state, isEdit){
            state.isEdit = isEdit;
        },
    }
};
