<template>
    <div>
        <div class="text-xs-center" v-if="loading">
            <v-progress-circular indeterminate
                                 size="128"
                                 width="16"
                                 color="primary"
            ></v-progress-circular>
        </div>
        <div v-if="!loading">

            <br>
            <p>
                <span style="width: 25%; float: left"><b>Tiêu đề</b></span>
                <span style="width: 75%; float: left"><b>{{task.title || 'Chưa xác định'}}</b></span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Nội dung tổng quát</span>
                <span style="width: 75%; float: left">{{task.summary || 'Chưa xác định'}}</span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Thuộc dự án</span>
                <span style="width: 75%; float: left">{{task.project.name || 'Chưa xác định'}}</span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p v-if="(isAdmin || isManager) && isChild">
                <span style="width: 25%; float: left">Thuộc tác vụ tổng</span>
                <router-link :to="`/tasks/${task.parentTask.id}`">
                        <span style="width: 75%; float: left">
                        {{task.parentTask.title || 'Chưa xác định'}}
                    </span>
                </router-link>
            </p>

            <br v-if="isChild">
            <v-divider v-if="isChild"></v-divider>
            <br v-if="isChild">


            <p>
                <span style="width: 25%; float: left">Trạng thái</span>
                <span style="width: 75%; float: left; position: relative; bottom: 10px;">
                    <v-chip v-if="task.status === 'Waiting'">Đang chờ</v-chip>
                <v-chip v-if="task.status === 'Working'" color="primary" text-color="white">Đang thực hiện</v-chip>
                <v-chip v-if="task.status === 'Completed'" color="success" text-color="white">Hoàn tất</v-chip>
                <v-chip v-if="task.status === 'Complete outdated'" color="error" text-color="white">Hoàn tất quá hạn
                </v-chip>
                <v-chip v-if="task.status === 'Outdated'" color="error" text-color="white">Quá hạn</v-chip>
                <v-chip v-if="task.status === 'Near deadline'" color="warning" text-color="white">Gần tới hạn
                </v-chip>
                <v-btn v-if="(completionRate === 1 || this.issuesStatus.total === 0) && isRunning && task.executor.id === userId"
                       @click="completeTask" color="success">Báo cáo hoàn tất
                </v-btn>
                </span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Số vấn đề hoàn tất</span>
                <span style="width: 75%; float: left">{{issuesStatus.completed}} / {{issuesStatus.total}}</span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Tỉ lệ hoàn thành</span>
                <span style="width: 75%; float: left">
                    <v-progress-circular :value="completionRate * 100" size="58" rotate="270" width="8"
                                         color="primary" style="position: relative; bottom: 20px">
                    <span style="color: black; font-size: 12px;">{{(completionRate * 100).toFixed(2) || 'Chưa xác định'}}%</span>
                </v-progress-circular>
                </span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Độ ưu tiên</span>
                <span :class="priorityColor(task.priority)" style="width: 75%; float: left">
                    {{task.priority || 'Chưa xác định'}}
                </span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Người tạo</span>
                <span style="width: 75%; float: left">{{task.creator.displayName || 'Chưa xác định'}}</span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Người xử lý</span>
                <span style="width: 75%; float: left">{{task.executor.displayName || 'Chưa xác định'}}</span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Thời gian tạo</span>
                <span style="width: 75%; float: left">
                    {{moment(task.createdTime, 'DD-MM-YYYY HH:mm:ss')
                    .format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                </span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Thời gian bắt đầu</span>
                <span style="width: 75%; float: left">
                    {{moment(task.startTime, 'DD-MM-YYYY HH:mm:ss')
                    .format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                </span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p>
                <span style="width: 25%; float: left">Thời gian kết thúc</span>
                <span style="width: 75%; float: left">
                    {{moment(task.endTime,'DD-MM-YYYY HH:mm:ss' )
                    .format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                </span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <p v-if="task.status === 'Completed' || task.status === 'Complete outdated'">
                <span style="width: 25%; float: left">Thời gian hoàn thành</span>
                <span style="width: 75%; float: left">
                     {{moment(task.completedTime, 'DD-MM-YYYY HH:mm:ss')
                    .format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                </span>
            </p>

            <br v-if="task.status === 'Completed' || task.status === 'Complete outdated'">
            <v-divider v-if="task.status === 'Completed' || task.status === 'Complete outdated'"></v-divider>
            <br v-if="task.status === 'Completed' || task.status === 'Complete outdated'">

            <p>
                <span style="width: 25%; float: left">Thời gian chỉnh sửa gần nhất</span>
                <span style="width: 75%; float: left; position: relative; bottom: 15px">
                    {{moment(task.lastModifiedTime,'DD-MM-YYYY HH:mm:ss' )
                     .format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                     <TaskHistory :task="task" ref="taskHistory">
                        <template #activator="{ on }">
                        <v-btn v-on="on" color="primary">Xem lịch sử chỉnh sửa</v-btn>
                        </template>
                     </TaskHistory>
                </span>
            </p>

            <br>
            <v-divider></v-divider>
            <br>

            <v-card>
                <v-card-title>Nội dung chi tiết</v-card-title>
                <v-divider></v-divider>
                <v-card-text v-html="task.description">
                    <span v-if="!task.description">Chưa xác định</span>
                </v-card-text>
            </v-card>
            <br>

            <v-layout row v-if="(isManager && isChild) || (isAdmin && !isChild)">
                <TaskForm v-if="isAdmin || isManager" @refresh="getTask" :form="{...form}">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">
                            <v-icon left>mdi-pencil</v-icon>
                            Chỉnh sửa
                        </v-btn>
                    </template>
                </TaskForm>
                <v-btn @click="deleteTask" color="error">
                    <v-icon left>mdi-delete</v-icon>
                    Xóa
                </v-btn>
            </v-layout>

            <br>

            <v-expansion-panel v-if="!isChild">
                <v-expansion-panel-content>

                    <template #header>
                        <span><v-icon left>mdi-file-tree</v-icon>Danh sách tác vụ phân nhỏ</span>
                    </template>

                    <TaskTable title="TÁC VỤ PHÂN NHỎ" :getTasksURL="`${this.id}/childs`"></TaskTable>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <br>
            <v-divider></v-divider>
            <br>

            <TaskIssue :task="{...task}" @refresh="refreshIssues"></TaskIssue>

            <br>
            <v-divider></v-divider>
            <br>

            <div v-if="task.creator.id === userId">
                <v-expansion-panel>
                    <v-expansion-panel-content>

                        <template #header>
                            <span><v-icon left>mdi-account-group</v-icon>Danh sách người theo dõi</span>
                        </template>
                        <div class="text-xs-center" v-if="!taskRelatives || (!!taskRelatives && !taskRelatives.length)">
                            <span>Không có người liên quan nào</span>
                        </div>

                        <v-list three-line>

                            <v-list-tile>
                                <TaskRelativeForm :task-id="id" @refresh="refreshRelatives">
                                    <template #activator="{ on }">
                                        <v-btn v-on="on" color="primary">
                                            <v-icon left>add</v-icon>
                                            Thêm người theo dõi
                                        </v-btn>
                                    </template>
                                </TaskRelativeForm>
                            </v-list-tile>

                            <v-list-tile v-for="user in taskRelatives" :key="user.id">
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{user.displayName}} - {{user.fullName}} - {{user.email}}
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title>
                                        Phòng ban: {{user.department.name || ''}}
                                    </v-list-tile-sub-title>
                                    <v-list-tile-sub-title>
                                        Chức vụ: {{roleName(user.role.name) || 'Chưa xác định'}}
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-btn @click="deleteRelative(user.id)" color="error">
                                        <v-icon left>mdi-delete</v-icon>
                                        Xóa
                                    </v-btn>
                                </v-list-tile-action>
                            </v-list-tile>

                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <br>
                <v-divider></v-divider>
                <br>
            </div>

            <v-expansion-panel>
                <v-expansion-panel-content>
                    <template #header>
                        <span><v-icon left>mdi-file-document</v-icon>Danh sách tài liệu liên quan</span>
                    </template>
                    <div class="text-xs-center" v-if="!documents || (!!documents && !documents.length)">
                        <span>Không có tài liệu nào</span>
                    </div>
                    <v-list three-line>
                        <v-list-tile v-if="task.creator.id === userId">
                            <TaskDocumentForm :task="task" :task-id="id" :project-id="task.project.id"
                                              @refresh="getTaskDocuments">
                                <template #activator="{on}">
                                    <v-btn v-on="on" color="primary">
                                        <v-icon left>add</v-icon>
                                        Thêm tài liệu liên quan
                                    </v-btn>
                                </template>
                            </TaskDocumentForm>
                        </v-list-tile>
                        <v-list-tile v-for="document in documents" :key="document.id">
                            <v-list-tile-content>
                                <v-list-tile-title>Tiêu đề: {{ document.title }}</v-list-tile-title>
                                <v-list-tile-sub-title>Tổng quát: {{ document.summary }}</v-list-tile-sub-title>
                                <v-list-tile-sub-title>
                                    <router-link :to="`/documents/${document.id}`">Đường dẫn tới tài liệu</router-link>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-btn @click="deleteTaskDocument(document.id)" color="error">
                                    <v-icon left>mdi-delete</v-icon>
                                    Xóa
                                </v-btn>
                            </v-list-tile-action>
                        </v-list-tile>
                    </v-list>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <br>
            <v-divider></v-divider>
            <br>

            <TaskFile :task="{...task}"></TaskFile>

            <br>
            <v-divider></v-divider>
            <br>

        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import TaskForm from "@/components/tasks/TaskForm";
    import TaskRelativeForm from "@/components/tasks/TaskRelativeForm";
    import {mapGetters, mapState} from 'vuex';
    import TaskTable from "./TaskTable";
    import moment from 'moment';
    import TaskDocumentForm from "@/components/tasks/TaskDocumentForm";
    import TaskIssue from "@/components/tasks/TaskIssue";
    import {pushNotif} from "@/firebase.js";
    import TaskHistory from "./TaskHistory";
    import TaskFile from "./TaskFile";

    export default {
        name: "TaskDetail",
        components: {TaskFile, TaskHistory, TaskIssue, TaskDocumentForm, TaskTable, TaskRelativeForm, TaskForm},
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
                    lastModifiedTime: '',
                    description: '',
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
                return this.issuesStatus.total === 0 ? 1 : this.issuesStatus.completed / this.issuesStatus.total;
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
            }),
            ...mapState('AUTHENTICATION', {
                userId: state => state.id,
                displayName: state => state.displayName,
            }),
        },
        mounted() {
            this.$nextTick(function () {
                this.loading = true;
                this.getTask();
            })
        },
        methods: {
            roleName(roleName) {
                switch (roleName) {
                    case 'ROLE_STAFF':
                        return 'Nhân viên phòng ban';
                    case 'ROLE_MANAGER':
                        return 'Quản lý phòng ban';
                    case 'ROLE_ADMIN':
                        return 'Giám đốc';
                    default:
                        return '';
                }
            },
            refreshIssues() {
                this.getIssuesStatus();
            },
            refreshRelatives: function () {
                this.getTaskRelatives();
            },
            getTask: function () {
                setTimeout(() => {
                    axios.get(`http://localhost:8080/tasks/${this.id}`)
                        .then(response => {
                            this.task = response.data;
                            this.getTaskRelatives();
                            this.getTaskDocuments();
                            this.getIssuesStatus();
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                        .finally(() => {
                            console.log('detail');
                            this.loading = false;
                        })
                }, 500);

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
                                var title = 'Một tác vụ đã hủy ' + this.displayName;
                                var detail = this.task.title;
                                var url = '/tasks/' + this.id;
                                var user = this.task.executor;
                                pushNotif(title, detail, url, user);
                                this.$router.push("/tasks");
                            }
                        )
                }
            },
            completeTask() {
                if (confirm('Bạn muốn báo cáo hoàn tất tác vụ này chứ?')) {
                    axios.patch(`http://localhost:8080/tasks/${this.id}/complete`)
                        .then(() => {
                            var title = 'Một tác vụ đã hoàn thành bởi ' + this.displayName;
                            var detail = this.task.title;
                            var url = '/tasks/' + this.id;
                            var user = this.task.creator;
                            pushNotif(title, detail, url, user);
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
                if (confirm('Bạn muốn xóa vấn đề này chứ?')) {
                    axios.delete(`http://localhost:8080/task-issues/${id}`)
                        .then(() => {
                            var title = 'Một vấn đề đã hủy bởi ' + this.displayName;
                            var detail = this.task.title;
                            var url = '/tasks/' + this.id;
                            var user = this.task.executor;
                            if (this.displayName === this.task.executor.displayName) {
                                user = this.task.cretor;
                            }
                            pushNotif(title, detail, url, user);
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
                            var url = '/tasks/' + this.id;
                            var user = this.task.cretor;
                            pushNotif(title, detail, url, user);
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
                if (confirm('Bạn muốn xóa người theo dõi này chứ')) {
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
                            var title = 'Tài liệu đã bị loại bỏ bởi ' + this.displayName;
                            var detail = this.task.title;
                            var url = '/tasks/' + this.id;
                            var user = this.task.executor;
                            pushNotif(title, detail, url, user);
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
            priorityColor(priority) {
                if (priority < 3)
                    return 'primary--text';
                if (priority < 4)
                    return 'yellow--text';
                if (priority < 5)
                    return 'warning--text';
                return 'red--text';
            }
        },
    }
</script>

<style scoped>

</style>