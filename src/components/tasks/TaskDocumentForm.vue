<template>
    <v-dialog v-model="dialog" width="500" persistent>
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">THÊM TÀI LIỆU LIÊN QUAN</span>
            </v-card-title>

            <v-card-text>
                <v-list two-line>
                    <template v-for="(documentOption, index) in documentOptions">
                        <v-list-tile :key="documentOption.id" @click="" v-ripple>
                            <v-list-tile-action>
                                <v-checkbox v-model="documents" :value="documentOption.id"></v-checkbox>
                            </v-list-tile-action>
                            <v-list-tile-content @click="documentSelect(documentOption.id)">
                                <v-list-tile-title>{{ index + 1 }}. {{ documentOption.title }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ documentOption.summary }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-card-text>

            <v-card-actions>
                <v-btn color="secondary" @click="close">
                    <v-icon left>clear</v-icon>
                    Hủy
                </v-btn>
                <v-btn color="primary" @click="save" :loading="loading">
                    <v-icon left>done</v-icon>
                    Thêm
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import {pushNotif} from "@/firebase";
    import {mapState} from 'vuex';

    export default {
        name: "TaskDocumentForm",
        data() {
            return {
                dialog: false,
                loading: false,
                documents: [],
                documentOptions: [],
                documentOptionsLoading: false,
                documentOptionsSearch: null,
            }
        },
        props: {
            taskId: Number,
            projectId: Number,
            task: Object,
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                displayName: state => state.displayName
            }),
        },
        methods: {
            documentSelect(id) {
                if (_.includes(this.documents, id)) {
                    this.documents.splice(this.documents.indexOf(id), 1);
                } else
                    this.documents.push(id);
            },
            close: function () {
                this.dialog = false;
            },
            save: function () {
                console.log(this.documents);
                this.loading = true;
                const url = `http://localhost:8080/tasks/${this.taskId}/documents/${this.documents.join()}`;
                const method = 'PUT';
                console.log(url, method);
                axios({url, method})
                    .then(() => {
                        var title = 'Tài liệu đã được bổ sung bởi ' + this.displayName;
                        var detail = '';
                        var url = '/tasks';
                        var users = [];
                        users.push(this.task.executor);
                        pushNotif(title,detail,url,users);
                        this.close();
                        this.$emit("refresh");
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getDocumentOptions: function () {
                this.documentOptionsLoading = true;
                axios.get(`http://localhost:8080/documents/search/all`, {
                    params: {
                        projectId: this.projectId,
                    }
                }).then(response => {
                    this.documentOptions = response.data;
                }).catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                    } else {
                        console.log(error.response);
                    }
                }).finally(() => {
                    this.documentOptionsLoading = false;
                });
            },
        },
        created() {
            this.debouncedGetDocumentOptions = _.debounce(this.getDocumentOptions, 500);
        },
        watch: {
            documentOptionsSearch: function (val) {
                if (val && !!val.length) {
                    this.debouncedGetDocumentOptions(val);
                }
            },
            documents: function () {
                this.documentOptionsSearch = '';
            },
            dialog(val) {
                if (val) {
                    this.getDocumentOptions();
                } else {
                    this.documents = [];
                }
            }
        }
    }
</script>

<style scoped>

</style>