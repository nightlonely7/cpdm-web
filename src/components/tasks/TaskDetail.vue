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
                <v-chip v-if="task.status === 'Waiting'">Đang chờ</v-chip>
                <v-chip v-if="task.status === 'Working'" color="primary" text-color="white">Đang thực hiện</v-chip>
                <v-chip v-if="task.status === 'Completed'" color="success" text-color="white">Hoàn tất</v-chip>
                <v-chip v-if="task.status === 'Complete outdated'" color="error" text-color="white">Hoàn tất quá hạn
                </v-chip>
                <v-chip v-if="task.status === 'Outdated'" color="error" text-color="white">Quá hạn</v-chip>
                <v-chip v-if="task.status === 'Near deadline'" color="warning" text-color="white">Gần tới hạn
                </v-chip>
                <v-btn v-if="(completionRate === 1 || this.issuesStatus.total === 0) && isRunning"
                       @click="completeTask">Báo cáo hoàn tất
                </v-btn>
                <br>
                <span>Số vấn đề hoàn tất: {{issuesStatus.completed}} / {{issuesStatus.total}}</span>
                <br>
                <span>Tỉ lệ hoàn thành:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <v-progress-circular :value="completionRate * 100" size="96" rotate="270" width="16" color="primary">
                    <span style="color: black">{{(completionRate * 100).toFixed(2) || 'Chưa xác định'}}%</span>
                </v-progress-circular>
            </p>
            <p>Độ ưu tiên: {{task.priority || 'Chưa xác định'}}</p>
            <p>Người tạo: {{task.creator.displayName || 'Chưa xác định'}}</p>
            <p>Người xử lý: {{task.executor.displayName || 'Chưa xác định'}}</p>
            <p>Thời gian tạo:
                {{moment(task.createdTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
            </p>
            <p>Thời gian bắt đầu:
                {{moment(task.startTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
            </p>
            <p>Thời gian kết thúc:
                {{moment(task.endTime,'DD-MM-YYYY HH:mm:ss' ).format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
            </p>
            <p v-if="task.status === 'Completed' || task.status === 'Complete outdated'">Thời gian hoàn thành:
                {{moment(task.completedTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
            </p>

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

                    <template #header>
                        Danh sách tác vụ phân nhỏ
                    </template>

                    <TaskTable title="TÁC VỤ PHÂN NHỎ" :getTasksURL="`${this.id}/childs`"></TaskTable>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <br>
            <v-divider></v-divider>
            <br>

            <v-expansion-panel>
                <v-expansion-panel-content>

                    <template #header>
                        Danh sách người theo dõi
                    </template>

                    <v-list>
                        <v-list-tile-content>
                            <v-list-tile>
                                <TaskRelativeForm :task-id="id" @refresh="refreshRelatives">
                                    <template #activator="{ on }">
                                        <v-btn v-on="on" color="primary">Thêm người theo dõi</v-btn>
                                    </template>
                                </TaskRelativeForm>

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

            <br>
            <v-divider></v-divider>
            <br>

            <v-expansion-panel>
                <v-expansion-panel-content>
                    <template #header>
                        Danh sách tài liệu liên quan
                    </template>
                    <v-list three-line>
                        <v-list-tile>
                            <TaskDocumentForm :task-id="id" :project-id="task.project.id" @refresh="getTaskDocuments">
                                <template #activator="{on}">
                                    <v-btn v-on="on" color="primary">Thêm tài liệu liên quan</v-btn>
                                </template>
                            </TaskDocumentForm>
                        </v-list-tile>
                        <v-list-tile v-for="document in documents" :key="document.id">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ document.title }}</v-list-tile-title>
                                <v-list-tile-sub-title>{{ document.summary }}</v-list-tile-sub-title>
                                <v-list-tile-sub-title>
                                    <router-link :to="`/documents/${document.id}`">Đường dẫn tới tài liệu</router-link>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn @click="deleteTaskDocument(document.id)">Xóa</v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>


                </v-expansion-panel-content>
            </v-expansion-panel>

            <br>
            <v-divider></v-divider>
            <br>

            <TaskIssue :task="{...task}" @refresh-issues-status="refreshIssuesStatus"></TaskIssue>

            <br>
            <v-divider></v-divider>
            <br>

            <v-layout row v-if="(isManager && isChild) || (isAdmin && !isChild)">
                <v-btn @click="deleteTask" color="error">
                    Xóa
                </v-btn>
                <TaskForm v-if="isAdmin || isManager" @refresh="getTask" :form="{...form}">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">Chỉnh sửa</v-btn>
                    </template>
                </TaskForm>
            </v-layout>


        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import TaskForm from "@/components/tasks/TaskForm";
    import TaskRelativeForm from "@/components/tasks/TaskRelativeForm";
    import {mapGetters} from 'vuex';
    import TaskTable from "./TaskTable";
    import moment from 'moment';
    import TaskDocumentForm from "@/components/tasks/TaskDocumentForm";
    import TaskIssue from "@/components/tasks/TaskIssue";

    export default {
        name: "TaskDetail",
        components: {TaskIssue, TaskDocumentForm, TaskTable, TaskRelativeForm, TaskForm},
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
                    status: '',
                    endTime: '',
                    startTime: '',
                    createdTime: '',
                    completedTime: '',
                },
                taskRelatives: [],
                documents: [],
                issuesStatus: {
                    total: 0,
                    completed: 0
                }
            }
        },
        computed: {
            isRunning() {
                return this.task.status === 'Working'
                    || this.task.status === 'Outdated'
                    || this.task.status === 'Near deadline'
            },
            isChild: function () {
                return !!this.task.parentTask;
            },
            completionRate: function () {
                return this.issuesStatus.total === 0 ? 0 : this.issuesStatus.completed / this.issuesStatus.total;
            },
            form: function () {
                return {
                    ...this.task,
                    startDate: moment(this.task.startTime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'),
                    startTime: moment(this.task.startTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm'),
                    endDate: moment(this.task.endTime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'),
                    endTime: moment(this.task.endTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm'),
                };
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
            refreshIssuesStatus() {
                this.getIssuesStatus();
            },
            refreshRelatives: function () {
                this.getTaskRelatives();
            },
            getTask: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}`)
                    .then(response => {
                        this.task = response.data;
                        this.getTaskRelatives();
                        this.getTaskDocuments();
                        this.getIssuesStatus();
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getIssuesStatus() {
               axios.get(`http://localhost:8080/tasks/${this.id}/issues/status`)
                   .then(response => {
                       this.issuesStatus = response.data;
                   })
            },
            getTaskRelatives: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}/relatives`)
                    .then(response => {
                        this.taskRelatives = response.data;
                    })
            },
            getTaskDocuments: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}/documents`)
                    .then(response => {
                        this.documents = response.data;
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
            completeTask() {
                if (confirm('Bạn muốn báo cáo hoàn tất Tác Vụ này chứ?')) {
                    axios.patch(`http://localhost:8080/tasks/${this.id}/complete`)
                        .then(() => {
                            this.getTask();
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
            deleteIssue: function (id) {
                if (confirm('Bạn muốn xóa Vấn Đề này chứ?')) {
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
            deleteTaskDocument: function (documentId) {
                if (confirm('Bạn muốn xóa bỏ liên kết này chứ ?')) {
                    axios.delete(`http://localhost:8080/tasks/${this.id}/documents/${documentId}`)
                        .then(() => {
                            this.getTaskDocuments();
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
    }
</script>

<style scoped>

</style>