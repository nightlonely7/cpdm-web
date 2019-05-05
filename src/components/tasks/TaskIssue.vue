<template>
    <v-expansion-panel v-model="issuePanel">
        <v-expansion-panel-content>

            <template #header>
                <span><v-icon left>mdi-format-list-checks</v-icon>Danh sách vấn đề</span>
            </template>

            <v-toolbar flat dense>
                <v-toolbar-items>
                    <v-divider vertical inset></v-divider>
                    <v-btn flat color="primary" @click="getIssues">
                        <v-icon left>cached</v-icon>
                        <span>Tải lại</span>
                    </v-btn>
                    <v-divider vertical inset></v-divider>
                    <TaskIssueForm :task="{...task}" @refresh="refreshIssues" creating
                                   v-if="(task.status === 'Waiting'|| isTaskRunning)
                                    && (task.creator.id === userId || task.executor.id === userId)">
                        <template #activator="{ on }">
                            <v-btn v-on="on" flat color="primary">
                                <v-icon left>add</v-icon>
                                <span>Thêm vấn đề</span>
                            </v-btn>
                        </template>
                    </TaskIssueForm>
                    <v-divider vertical inset
                               v-if="(task.status === 'Waiting'|| isTaskRunning)
                                    && (task.creator.id === userId || task.executor.id === userId)"></v-divider>
                </v-toolbar-items>
            </v-toolbar>

            <div class="text-xs-center" v-if="issueLoading">
                <br>
                <v-progress-circular indeterminate
                                     size="64"
                                     width="8"
                                     color="primary"
                ></v-progress-circular>
                <br>
            </div>

            <div class="text-xs-center" v-if="!issueLoading && !issues.length">
                <br>
                <span>Không có vấn đề nào</span>
            </div>

            <v-container v-if="issueLoaded">
                <template v-for="issue in issues">
                    <div :key="issue.id">
                        <v-card>
                            <v-card-text>
                                <p>
                                    <span style="width: 25%; float: left">Nội dung tóm tắt</span>
                                    <span style="width: 75%; float: left"><b>{{issue.summary}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Mô tả</span>
                                    <span style="width: 75%; float: left">{{issue.description}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Trạng thái</span>
                                    <span style="width: 75%; float: left; position: relative; bottom: 13px">
                                        <v-chip :color="`${issue.completed ? 'success' : ''}`">
                                    {{issue.completed ? 'Hoàn tất' : 'Chưa hoàn tất'}}
                                </v-chip>
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <template v-if="issue.completedTime">
                                    <p>
                                        <span style="width: 25%; float: left">Thời gian hoàn thành</span>
                                        <span style="width: 75%; float: left">{{moment(issue.completedTime).format('DD/MM/YYYY HH:mm:ss')}}</span>
                                    </p>

                                    <br>
                                    <v-divider></v-divider>
                                    <br>
                                </template>

                                <p>
                                    <span style="width: 25%; float: left">Người tạo</span>
                                    <span style="width: 75%; float: left">{{issue.creator.displayName}} - {{issue.creator.email}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời gian tạo</span>
                                    <span style="width: 75%; float: left">{{moment(issue.createdTime).format('DD/MM/YYYY HH:mm:ss')}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Người chỉnh sửa gần nhất</span>
                                    <span style="width: 75%; float: left">{{issue.lastEditor.displayName}} - {{issue.lastEditor.email}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời gian chỉnh sửa gần nhất</span>
                                    <span style="width: 75%; float: left">{{moment(issue.lastModifiedTime).format('DD/MM/YYYY HH:mm:ss')}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>

                            </v-card-text>
                            <v-card-actions>
                                <v-flex v-if="!issue.completed && task.status !== 'Waiting' && task.executor.id === userId">
                                    <v-btn color="success" @click="completeIssue(issue.id)">
                                        <v-icon left>mdi-check</v-icon>
                                        <span>Báo cáo hoàn tất</span>
                                    </v-btn>
                                </v-flex>
                                <v-flex v-if="!issue.completed && (task.creator.id === userId || task.executor.id === userId)">
                                    <TaskIssueForm :task="{...task}" :form="{...issue}"
                                                   @refresh="refreshIssues">
                                        <template #activator="{ on }">
                                            <v-btn color="primary" v-on="on">
                                                <v-icon left>mdi-pencil</v-icon>
                                                <span>Sửa</span>
                                            </v-btn>
                                        </template>
                                    </TaskIssueForm>
                                </v-flex>
                                <v-flex v-if="!issue.completed && (task.creator.id === userId
                                            || task.executor.id === userId)">
                                    <v-btn color="error" @click="deleteIssue(issue.id)">
                                        <v-icon left>mdi-delete</v-icon>
                                        <span>Xóa</span>
                                    </v-btn>
                                </v-flex>
                            </v-card-actions>
                        </v-card>
                        <br>
                    </div>
                </template>
            </v-container>

            <br v-if="!issues.length">


        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import axios from 'axios';
    import TaskIssueForm from "@/components/tasks/TaskIssueForm";
    import {mapState} from "vuex";
    import {pushNotif} from "@/firebase.js";

    export default {
        name: "TaskIssue",
        components: {TaskIssueForm},
        data() {
            return {
                issuePanel: null,
                issueLoaded: false,
                issueLoading: false,
                issues: [{
                    id: 0,
                    summary: '',
                    description: '',
                    completed: false,
                    creator: {},
                    lastEditor: {},
                }],
            }
        },
        props: {
            task: Object,
        },
        computed: {
            isTaskRunning() {
                return this.task.status === 'Working'
                    || this.task.status === 'Outdated'
                    || this.task.status === 'Near deadline'
            },
            ...mapState('AUTHENTICATION', {
                userId: state => state.id,
                displayName: state => state.displayName,
            }),
        },
        methods: {
            refreshIssues() {
                this.getIssues();
                this.$emit("refresh");
            },
            getIssues() {
                console.log('get issue');
                this.issueLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/tasks/${this.task.id}/issues`)
                        .then(response => {
                            this.issues = response.data;
                            this.issueLoaded = true;
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                        .finally(() => {
                            this.issueLoading = false;
                        })
                }, 500)

            },
            deleteIssue(id) {
                if (confirm('Bạn muốn xóa vấn đề này chứ?')) {
                    axios.delete(`http://localhost:8080/task-issues/${id}`)
                        .then(() => {
                            var title = 'Một vấn đề đã hủy bởi ' + this.displayName;
                            var detail = this.task.title;
                            var url = '/tasks/' + this.task.id;
                            var users = [];
                            if (this.displayName === this.task.executor.displayName) {
                                users.push(this.task.cretor);
                            } else {
                                users.push(this.task.executor);
                            }
                            pushNotif(title, detail, url, users);
                            this.refreshIssues();
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                }
            },
            completeIssue(id) {
                if (confirm('Bạn muốn báo cáo hoàn tất Vấn Đề này chứ?')) {
                    axios.patch(`http://localhost:8080/task-issues/${id}/complete`)
                        .then(() => {
                            var title = 'Một vấn đề đã hoàn thành bởi ' + this.displayName;
                            var detail = this.task.title;
                            var url = '/tasks/' + this.task.id;
                            var users = [];
                            users.push(this.task.cretor);
                            pushNotif(title, detail, url, users);
                            this.refreshIssues();
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                }
            },
        },
        watch: {
            issuePanel(val) {
                if (val === 0) {
                    if (!this.issueLoaded) {
                        this.getIssues();
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>