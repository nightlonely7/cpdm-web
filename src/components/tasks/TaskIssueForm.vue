<template>
    <v-dialog width="500" v-model="dialog" persistent>
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">FORM VẤN ĐỀ</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex md12>
                            <v-text-field v-model="form.summary"
                                          label="Nội dung tổng quát"
                                          :rules="summaryRules"
                                          validate-on-blur
                            ></v-text-field>
                        </v-flex>
                        <v-flex md12>
                            <v-text-field v-model="form.description"
                                          label="Nội dung chi tiết"
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
    import {pushNotif} from "@/firebase.js";

    export default {
        name: "TaskIssueForm",
        data() {
            return {
                dialog: false,
                loading: false,
                summaryRules: [
                    val => (!!val && val.length >= 4) || "Ít nhất 4 kí tự",
                ]
            }
        },
        props: {
            taskId: Number,
            form: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        summary: '',
                        description: '',
                    };
                }
            },
            task: Object,
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                userId: state => state.id,
                displayName: state => state.displayName,
            }),
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.loading = true;
                const url = this.form.id === 0
                    ? `http://localhost:8080/tasks/${this.taskId}/issues`
                    : `http://localhost:8080/task-issues/${this.form.id}`;
                const method = this.form.id === 0 ? 'POST' : 'PUT';
                const data = {...this.form};
                console.log(url, method, data);
                axios({url, method, data})
                    .then((response) => {
                        var title = 'Một vấn đề đã được thêm bởi ' + this.displayName;
                        var detail = '';
                        var url = '/tasks';
                        var users = [];
                        if(this.displayName === this.task.executor.displayName){
                            users.push(this.task.cretor);
                        }
                        else{
                            users.push(this.task.executor);
                        }
                        pushNotif(title,detail,url,users);
                        console.log(response.data);
                        this.dialog = false;
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