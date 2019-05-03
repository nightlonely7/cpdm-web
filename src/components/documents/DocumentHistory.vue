<template>
    <v-dialog v-model="documentHistoryDialog" fullscreen transition="dialog-bottom-transition">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click="documentHistoryDialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Bản lưu của tài liệu '{{document.title}}'</v-toolbar-title>
            </v-toolbar>
            <v-progress-linear v-if="historiesLoading" indeterminate></v-progress-linear>
            <v-card-text>
                <v-expansion-panel v-model="documentHistoryExpansionPanel">
                    <v-expansion-panel-content v-for="(documentHistory, index) in documentHistories"
                                               :key="documentHistory.id">
                        <template #header>
                            Bản lưu lúc {{moment(documentHistory.createdTime).format('DD/MM/YYYY HH:mm:ss')}}
                            bởi {{documentHistory.creator.displayName}}
                        </template>
                        <DocumentHistoryDetail :activate="documentHistoryExpansionPanel === index"
                                           :id="documentHistory.id"></DocumentHistoryDetail>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from 'axios';
    import DocumentHistoryDetail from "./DocumentHistoryDetail";

    export default {
        name: "DocumentHistory",
        components: {DocumentHistoryDetail},
        data() {
            return {
                documentHistoryExpansionPanel: [],
                documentHistoryDialog: false,
                historiesLoading: false,
                historiesLoaded: false,
                documentHistories: [],
            }
        },
        props: {
            document: Object
        },
        methods: {
            getDocumentHistories() {
                this.historiesLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/documents/${this.document.id}/histories`)
                        .then(response => {
                            this.documentHistories = response.data;
                            console.log("Document history: " + response.data);
                            this.historiesLoaded = true;
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                        .finally(() => {
                            this.historiesLoading = false;
                        })
                }, 500);

            },
        },
        watch: {
            documentHistoryDialog(val) {
                if (val) {
                    if (!this.historiesLoaded) {
                        this.getDocumentHistories();
                    }
                }
            },
            document() {
                this.historiesLoaded = false;
            },
        }
    }
</script>

<style scoped>

</style>