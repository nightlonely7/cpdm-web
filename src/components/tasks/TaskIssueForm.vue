<template>
    <v-dialog width="500" v-model="dialog" persistent>
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click="dialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>{{creating ? 'TẠO MỚI' : 'CHỈNH SỬA'}} VẤN ĐỀ</v-toolbar-title>
            </v-toolbar>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field v-model="form.summary"
                                          label="Nội dung tóm tắt"
                                          :rules="summaryRules"
                                          validate-on-blur
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea v-model="form.description"
                                          label="Mô tả"
                            ></v-textarea>
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
            creating: Boolean,
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
                const url = this.creating
                    ? `http://localhost:8080/tasks/${this.task.id}/issues`
                    : `http://localhost:8080/task-issues/${this.form.id}`;
                const method = this.creating ? 'POST' : 'PUT';
                const data = {...this.form};
                console.log(url, method, data);
                axios({url, method, data})
                    .then(() => {
                        var title = this.creating ? 'Một vấn đề đã được thêm bởi ' + this.displayName : 'Một vấn đề đã được sửa bởi ' + this.displayName;
                        var detail = this.task.title;
                        var url = '/tasks/' + this.task.id;
                        var user = this.task.executor;
                        if(this.displayName === this.task.executor.displayName){
                            user = this.task.creator;
                        }
                        pushNotif(title,detail,url,user);
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