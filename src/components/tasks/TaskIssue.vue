<template>
    <v-expansion-panel v-model="issuePanel">
        <v-expansion-panel-content>

            <template #header>
                Danh sách vấn đề
            </template>

            <div class="text-xs-center" v-if="issueLoading">
                <v-progress-circular indeterminate
                                     size="64"
                                     width="8"
                                     color="primary"
                ></v-progress-circular>
                <br>
                <br>
            </div>

            <div class="text-xs-center" v-if="!issueLoading && !issues.length">
                <span>Không có vấn đề nào</span>
            </div>

            <v-list three-line>
                <v-list-tile
                        v-if="(task.status === 'Waiting'|| isTaskRunning)
                                    && (task.creator.id === userId || task.executor.id === userId)">
                    <v-list-tile-content>
                        <TaskIssueForm @refresh="refreshIssues" :task-id="task.id" :task="task">
                            <template #activator="{ on }">
                                <v-btn v-on="on" color="primary">Thêm vấn đề</v-btn>
                            </template>
                        </TaskIssueForm>
                    </v-list-tile-content>

                </v-list-tile>
                <template v-for="issue in issues">
                    <v-list-tile :key="issue.id">
                        <v-list-tile-content>
                            <v-list-tile-title>{{issue.summary}}</v-list-tile-title>
                            <v-list-tile-sub-title>{{issue.description}}</v-list-tile-sub-title>
                            <v-list-tile-sub-title>
                                <span>Trạng thái :</span>
                                <v-chip :color="`${issue.completed ? 'success' : ''}`">
                                    {{issue.completed ? 'Hoàn tất' : 'Chưa hoàn tất'}}
                                </v-chip>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action-text>
                            <v-btn v-if="!issue.completed && task.status !== 'Waiting' && task.executor.id === userId"
                                   @click="completeIssue(issue.id)" color="success">Báo cáo hoàn tất
                            </v-btn>
                        </v-list-tile-action-text>
                        <v-list-tile-action-text
                                v-if="(task.creator.id === userId || task.executor.id === userId)">
                            <TaskIssueForm @refresh="refreshIssues" :task-id="task.id" :form="{...issue}"
                                           v-if="!issue.completed"
                            >
                                <template #activator="{ on }">
                                    <v-btn v-on="on" color="primary">Sửa</v-btn>
                                </template>
                            </TaskIssueForm>
                        </v-list-tile-action-text>
                        <v-list-tile-action-text>
                            <v-btn v-if="!issue.completed && (task.creator.id === userId || task.executor.id === userId)"
                                   color="error" @click="deleteIssue(issue.id)">Xóa
                            </v-btn>
                        </v-list-tile-action-text>
                    </v-list-tile>
                </template>
            </v-list>
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
                            var detail = '';
                            var url = '/tasks';
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
                            var detail = '';
                            var url = '/tasks';
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