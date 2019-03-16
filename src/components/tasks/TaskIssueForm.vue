<template>
    <v-dialog width="500" v-model="showIssueForm" persistent>
        <v-card>
            <v-card-title>
                <span class="headline">FORM VẤN ĐỀ</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex md12>
                            <v-text-field v-model="taskIssueForm.summary"
                                          label="Nội dung tổng quát"
                            ></v-text-field>
                        </v-flex>
                        <v-flex md12>
                            <v-text-field v-model="taskIssueForm.detail"
                                          label="Nội dung chi tiết"
                            ></v-text-field>
                        </v-flex>
                        <v-flex md12>
                            <v-text-field v-model="taskIssueForm.weight"
                                          label="Trọng số"
                                          type="number"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="secondary" @click="close">
                    <v-icon left>clear</v-icon>
                    Hủy
                </v-btn>
                <v-btn color="primary" @click="save" :loading="loading">
                    <v-icon left>done</v-icon>
                    Lưu
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex';

    export default {
        name: "TaskIssueForm",
        data() {
            return {
                loading: false,
            }
        },
        computed: {
            ...mapState('TASK_STORE', {
                taskIssueForm: state => state.taskIssueForm,
                showIssueForm: state => state.showIssueForm,
                taskId: state => state.taskId,
            }),
        },
        methods: {
            close: function () {
                this.$store.commit('TASK_STORE/SET_SHOW_ISSUE_FORM', false);
            },
            save: function () {
                this.loading = true;
                const url = this.taskIssueForm.id === 0
                    ? `http://localhost:8080/tasks/${this.taskId}/issues`
                    : `http://localhost:8080/taskIssues/${this.taskIssueForm.id}`;
                const method = this.taskIssueForm.id === 0 ? 'POST' : 'PUT';
                const data = {...this.taskIssueForm};
                console.log(url, method, data);
                axios({url, method, data})
                    .then((response) => {
                        console.log(response.data);
                        this.$store.commit('TASK_STORE/SET_SHOW_ISSUE_FORM', false);
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
            }
        },

    }
</script>

<style scoped>

</style>