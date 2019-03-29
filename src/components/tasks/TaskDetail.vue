<template>
    <div>
        <div class="text-xs-center">
            <v-progress-circular v-if="loading" indeterminate
                                 size="128"
                                 width="16"
                                 color="primary"
            ></v-progress-circular>
        </div>
        <div v-if="!loading">
            <h2>Tiêu đề : {{task.title || 'Chưa xác định'}}</h2>
            <v-divider></v-divider>
            <br>
            <h4>Nội dung tổng quát: </h4>
            <p>{{task.summary || 'Chưa xác định'}}</p>
            <br>
            <p>Thuộc dự án: {{task.project.name || 'Chưa xác định'}}</p>
            <br>
            <p v-if="isChild">Thuộc tác vụ tổng:
                <router-link :to="`/tasks/${task.parentTask.id}`">
                    {{task.parentTask.title || 'Chưa xác định'}}
                </router-link>
            </p>
            <br v-if="isChild">

            <p>Trạng thái:
                <v-chip>{{task.status || 'Chưa xác định'}}</v-chip>
                <br>
                <span>Số vấn đề hoàn tất: {{totalComplete}} / {{totalIssues}}</span>
                <br>
                <span>Tỉ lệ hoàn thành:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <v-progress-circular :value="completionRate * 100" size="96" rotate="270" width="16" color="primary">
                    <span style="color: black">{{(completionRate * 100).toFixed(2) || 'Chưa xác định'}}%</span>
                </v-progress-circular>
            </p>
            <p>Độ ưu tiên: {{task.priority || 'Chưa xác định'}}</p>
            <p>Người tạo: {{task.creator.displayName || 'Chưa xác định'}}</p>
            <p>Người xử lý: {{task.executor.displayName || 'Chưa xác định'}}</p>
            <p>Thời gian tạo: {{task.createdTime || 'Chưa xác định'}}</p>
            <p>Thời gian bắt đầu: {{task.startTime || 'Chưa xác định'}}</p>
            <p>Thời gian kết thúc: {{task.endTime || 'Chưa xác định'}}</p>

            <v-card>
                <v-card-title>Nội dung chi tiết</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    {{task.description || 'Chưa xác định'}}
                </v-card-text>
            </v-card>
            <br>

            <v-expansion-panel v-if="isAdmin && !isChild">
                <v-expansion-panel-content>

                    <template slot="header">
                        Danh sách tác vụ phân nhỏ
                    </template>

                    <TaskTable title="TÁC VỤ PHÂN NHỎ" :getTasksURL="`${this.id}/childs`"></TaskTable>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-content>

                    <template slot="header">
                        Danh sách người theo dõi
                    </template>

                    <v-list>
                        <v-list-tile-content>
                            <v-list-tile>
                                <v-btn @click="showRelativeForm">Thêm người liên quan</v-btn>
                            </v-list-tile>
                            <v-list-tile v-for="user in taskRelatives" :key="user.id">
                                {{user.displayName}} - {{user.fullName}} - {{user.email}} -
                                Phòng ban: {{user.department.name || ''}} -
                                Chức vụ: {{user.role.name || ''}}
                                <v-btn @click="deleteRelative(user.id)">Xóa</v-btn>
                            </v-list-tile>
                        </v-list-tile-content>
                    </v-list>


                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-content>

                    <template slot="header">
                        Danh sách vấn đề
                    </template>

                    <v-list>
                        <v-list-tile-content>
                            <v-list-tile>
                                <v-btn @click="showIssueForm">Thêm vấn đề</v-btn>

                            </v-list-tile>
                            <v-list-tile v-for="issue in taskIssues" :key="issue.id">
                                {{issue.summary}} - {{issue.detail}}
                                <v-btn @click="editIssue(issue)">Sửa</v-btn>
                                <v-btn @click="deleteIssue(issue.id)">Xóa</v-btn>
                            </v-list-tile>
                        </v-list-tile-content>
                    </v-list>


                </v-expansion-panel-content>
            </v-expansion-panel>

            <br>
            <v-divider></v-divider>
            <v-layout row v-if="(isManager && isChild) || (isAdmin && !isChild)">
                <v-btn @click="deleteTask" color="error">
                    Xóa
                </v-btn>
                <TaskForm v-if="isAdmin || isManager" @refresh="getTask" :form="form">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">Chỉnh sửa</v-btn>
                    </template>
                </TaskForm>
            </v-layout>
            <TaskIssueForm @refresh="refreshIssues"></TaskIssueForm>
            <TaskRelativeForm @refresh="refreshRelatives"></TaskRelativeForm>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import TaskForm from "@/components/tasks/TaskForm";
    import TaskIssueForm from "@/components/tasks/TaskIssueForm";
    import TaskRelativeForm from "@/components/tasks/TaskRelativeForm";
    import {mapGetters} from 'vuex';
    import TaskTable from "./TaskTable";

    export default {
        name: "TaskDetail",
        components: {TaskTable, TaskRelativeForm, TaskIssueForm, TaskForm},
        props: {
            id: Number
        },
        data() {
            return {
                loading: false,
                task: {
                    creator: {},
                    executor: {},
                    project: {},
                    parentTask: {},
                },
                taskIssues: [],
                taskRelatives: [],
            }
        },
        computed: {
            isChild: function () {
                return !!this.task.parentTask;
            },
            totalIssues: function () {
                return this.taskIssues ? this.taskIssues.length : 0;
            },
            totalComplete: function () {
                let totalComplete = 0;
                if (this.taskIssues) {
                    this.taskIssues.forEach(function (issue) {
                        if (issue.status === 'completed') {
                            totalComplete++;
                        }
                    });
                }
                return totalComplete;
            },
            completionRate: function () {
                return this.totalComplete === 0 ? 0 : this.totalComplete / this.totalIssues;
            },
            form: function () {
                return {...this.task};
            },
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            })
        },
        mounted() {
            this.$nextTick(function () {
                this.loading = true;
                this.getTask();
            })
        },
        methods: {
            refreshIssues: function () {
                this.getTaskIssues();
            },
            refreshRelatives: function () {
                this.getTaskRelatives();
            },
            getTask: function () {
                setTimeout(() => {
                    axios.get(`http://localhost:8080/tasks/${this.id}`)
                        .then(response => {
                            Object.assign(this.task, response.data);
                            this.getTaskIssues();
                            this.getTaskRelatives();
                        })
                        .finally(() => {
                            this.loading = false;
                        })
                }, 1500)

            },
            getTaskIssues: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}/issues`)
                    .then(response => {
                        this.taskIssues = response.data;
                    })
            },
            getTaskRelatives: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}/relatives`)
                    .then(response => {
                        this.taskRelatives = response.data;
                    })
            },
            deleteTask: function () {
                if (confirm('Xóa?')) {
                    axios.delete(`http://localhost:8080/tasks/${this.id}`)
                        .then(() => {
                                this.$router.push("/tasks");
                            }
                        )
                }
            },
            editIssue: function (issue) {
                this.$store.commit('TASK_STORE/SET_TASK_ISSUE_FORM', issue);
                this.$store.commit('TASK_STORE/SET_SHOW_ISSUE_FORM', true);
            },
            deleteIssue: function (id) {
                if (confirm('Bạn muốn xóa Vấn đề này chứ')) {
                    axios.delete(`http://localhost:8080/taskIssues/${id}`)
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
            deleteRelative: function (userId) {
                if (confirm('Bạn muốn xóa Người liên quan này chứ')) {
                    axios.delete(`http://localhost:8080/tasks/${this.id}/relatives/${userId}`)
                        .then(() => {
                            this.refreshRelatives();
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
            showIssueForm: function () {
                this.$store.commit('TASK_STORE/SET_TASK_ISSUE_FORM', {id: 0});
                this.$store.commit('TASK_STORE/SET_SHOW_ISSUE_FORM', true);
            },
            showRelativeForm: function () {
                this.$store.commit('TASK_STORE/SET_SHOW_RELATIVE_FORM', true);
            }
        },
        // watch: {
        //     id: function () {
        //         this.$router.go();
        //     }
        // }
    }
</script>

<style scoped>

</style>