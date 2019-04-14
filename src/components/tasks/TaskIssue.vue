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

            <div v-if="!issueLoading">
                <v-list>
                    <v-list-tile-content>
                        <v-list-tile v-if="task.status === 'Waiting'|| isTaskRunning">
                            <TaskIssueForm @refresh="refreshIssues" :task-id="task.id">
                                <template #activator="{ on }">
                                    <v-btn v-on="on" color="primary">Thêm vấn đề</v-btn>
                                </template>
                            </TaskIssueForm>

                        </v-list-tile>
                        <v-list-tile v-for="issue in issues" :key="issue.id">
                            {{issue.summary}} - {{issue.description}}
                            <v-chip :color="`${issue.completed ? 'success' : ''}`">
                                {{issue.completed ? 'Hoàn tất' : 'Chưa hoàn tất'}}
                            </v-chip>
                            <TaskIssueForm @refresh="refreshIssues" :task-id="task.id" :form="{...issue}"
                                           v-if="!issue.completed"
                            >
                                <template #activator="{ on }">
                                    <v-btn v-on="on" color="primary">Sửa</v-btn>
                                </template>
                            </TaskIssueForm>
                            <v-btn v-if="!issue.completed" @click="deleteIssue(issue.id)">Xóa</v-btn>
                            <v-btn v-if="!issue.completed" @click="completeIssue(issue.id)">Báo cáo hoàn tất</v-btn>
                        </v-list-tile>
                    </v-list-tile-content>
                </v-list>
            </div>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import axios from 'axios';
    import TaskIssueForm from "@/components/tasks/TaskIssueForm";

    export default {
        name: "TaskIssue",
        components: {TaskIssueForm},
        data() {
            return {
                issuePanel: [false],
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
        },
        methods: {
            refreshIssues() {
                this.getIssues();
                this.$emit("refresh-issues-status");
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