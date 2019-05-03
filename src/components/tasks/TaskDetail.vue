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
            <h2>Tiêu đề : {{task.title || 'Chưa xác định'}}</h2>
            <v-divider></v-divider>
            <br>
            <h4>Nội dung tổng quát: </h4>
            <p>{{task.summary || 'Chưa xác định'}}</p>
            <br>
            <p>Thuộc dự án: {{task.project.name || 'Chưa xác định'}}</p>
            <br>
            <p v-if="(isAdmin || isManager) && isChild">Thuộc tác vụ tổng:
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
                <v-btn v-if="(completionRate === 1 || this.issuesStatus.total === 0) && isRunning && task.executor.id === userId"
                       @click="completeTask" color="success">Báo cáo hoàn tất
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
                {{moment(task.createdTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
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
            <p>Thời gian chỉnh sửa gần nhất:
                {{moment(task.lastModifiedTime,'DD-MM-YYYY HH:mm:ss' ).format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                <TaskHistory :task="task" ref="taskHistory">
                    <template #activator="{ on }">
                        <v-btn v-on="on" color="primary">Xem lịch sử chỉnh sửa</v-btn>
                    </template>
                </TaskHistory>
            </p>

            <v-card>
                <v-card-title>Nội dung chi tiết</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    {{task.description || 'Chưa xác định'}}
                </v-card-text>
            </v-card>
            <br>

            <v-expansion-panel v-if="!isChild">
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

            <TaskIssue :task="{...task}" @refresh="refreshIssues"></TaskIssue>

            <br>
            <v-divider></v-divider>
            <br>

            <div v-if="task.creator.id === userId">
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
            </div>

            <v-expansion-panel>
                <v-expansion-panel-content>
                    <template #header>
                        Danh sách tài liệu liên quan
                    </template>
                    <div class="text-xs-center" v-if="!documents || (!!documents && !documents.length)">
                        <span>Không có tài liệu nào</span>
                    </div>
                    <v-list three-line>
                        <v-list-tile v-if="task.creator.id === userId">
                            <TaskDocumentForm :task="task" :task-id="id" :project-id="task.project.id" @refresh="getTaskDocuments">
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

            <TaskFile :task="{...task}"></TaskFile>

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
            refreshIssues() {
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
                            var detail = '';
                            var url = '/tasks/' + this.id;
                            var users = [];
                            users.push(this.task.executor);
                            pushNotif(title,detail,url,users);
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
                            var detail = '';
                            var url = '/tasks/' + this.id;
                            var users = [];
                            users.push(this.task.creator);
                            pushNotif(title,detail,url,users);
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
                            var detail = '';
                            var url = '/tasks/' + this.id;
                            var users = [];
                            if(this.displayName === this.task.executor.displayName){
                                users.push(this.task.cretor);
                            }
                            else{
                                users.push(this.task.executor);
                            }
                            pushNotif(title,detail,url,users);
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
                            var url = '/tasks/' + this.id;
                            var users = [];
                            users.push(this.task.cretor);
                            pushNotif(title,detail,url,users);
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
                            var detail = '';
                            var url = '/tasks/' + this.id;
                            var users = [];
                            users.push(this.task.executor);
                            pushNotif(title,detail,url,users);
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