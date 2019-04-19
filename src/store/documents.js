const documentStoreDefaultState = () => {
    return {
        documents: [],
        documentForm: {},
        isEdit: true,
        documentName: '',
        currentDocument: {},
        titleSearchValue: '',
        summarySearchValue: '',
    }
};

export default {
    namespaced: true,
    state: documentStoreDefaultState(),
    mutations: {
        SET_DEPARTMENTS(state, documents){
            state.documents = documents;
        },
        SET_DOCUMENT_FORM(state, documentForm){
            state.documentForm = documentForm;
        },
        SET_IS_EDIT(state, isEdit){
            state.isEdit = isEdit;
        },
        SET_DOCUMENT_NAME(state, documentName){
            state.documentName = documentName;
        },
        SET_CURRENT_DOCUMENT(state, currentDocument){
            state.currentDocument = currentDocument;
        },
        SET_TITLE_SEARCH_VALUE(state, titleSearchValue) {
            state.titleSearchValue = titleSearchValue
        },
        SET_SUMMARY_SEARCH_VALUE(state, summarySearchValue) {
            state.summarySearchValue = summarySearchValue
        },
    }
};
