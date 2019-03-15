<template>
    <div>
        <h2>Tiêu đề : {{task.title}}</h2>
        <v-divider></v-divider>
        <br>
        <h4>Nội dung tổng quát: </h4>
        <p>{{task.summary}}</p>
        <br>

        <p>Trạng thái:
            <v-chip>{{task.status}}</v-chip>
            <br>
            <span>Tỉ lệ hoàn thành:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <v-progress-circular :value="completionRate * 100" size="96" rotate="270" width="16" color="primary">
                <span style="color: black">{{(completionRate * 100).toFixed(2)}}%</span>
            </v-progress-circular>
        </p>
        <p>Độ ưu tiên: {{task.priority}}</p>
        <p>Người tạo: {{task.creator.displayName}}</p>
        <p>Người xử lý: {{task.executor.displayName}}</p>
        <p>Thời gian tạo: {{task.createdTime}}</p>
        <p>Thời gian bắt đầu: {{task.startTime}}</p>
        <p>Thời gian kết thúc: {{task.endTime}}</p>

        <v-card>
            <v-card-title>Nội dung chi tiết</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                {{task.description}}
            </v-card-text>
        </v-card>
        <br>

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
                            {{issue.summary}} - {{issue.detail}} - {{issue.weight}}
                            <v-btn @click="editIssue(issue)">Sửa</v-btn>
                            <v-btn @click="deleteIssue(issue.id)">Xóa</v-btn>
                        </v-list-tile>
                    </v-list-tile-content>
                </v-list>


            </v-expansion-panel-content>
        </v-expansion-panel>

        <br>
        <v-divider></v-divider>
        <v-btn @click="deleteTask" color="error">
            Xóa
        </v-btn>
        <v-btn @click="showForm">
            Sửa
        </v-btn>
        <TaskForm @refresh="getTask"></TaskForm>
        <TaskIssueForm @refresh="refreshIssues"></TaskIssueForm>
        <TaskRelativeForm @refresh="refreshRelatives"></TaskRelativeForm>
    </div>
</template>

<script>
    import axios from 'axios'
    import TaskForm from "@/components/tasks/TaskForm";
    import TaskIssueForm from "@/components/tasks/TaskIssueForm";
    import TaskRelativeForm from "@/components/tasks/TaskRelativeForm";

    export default {
        name: "TaskDetail",
        components: {TaskRelativeForm, TaskIssueForm, TaskForm},
        props: {
            id: Number
        },
        data() {
            return {
                task: {
                    creator: {},
                    executor: {},
                },
                taskIssues: [],
                taskRelatives: [],
            }
        },
        computed: {
            completionRate: function () {
                let totalWeight = 0;
                let totalComplete = 0;
                if (this.taskIssues) {
                    this.taskIssues.forEach(function (issue) {
                        totalWeight += issue.weight;
                        if (issue.status === 'completed') {
                            totalComplete += issue.weight;
                        }
                    });
                }
                return totalComplete === 0 ? 0 : totalComplete / totalWeight;
            },
        },
        mounted() {
            this.$nextTick(function () {
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
            showForm: function () {
                this.$store.commit('TASK_STORE/SET_SHOW_FORM', true);
                const taskForm = {
                    id: this.task.id,
                    title: this.task.title,
                    summary: this.task.summary,
                    description: this.task.description,
                    startTime: this.task.startTime,
                    endTime: this.task.endTime,
                    executor: this.task.executor,
                    priority: this.task.priority
                };
                this.$store.commit('TASK_STORE/SET_TASK_FORM', taskForm);
            },
            getTask: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}`)
                    .then(response => {
                        Object.assign(this.task, response.data);
                        this.getTaskIssues();
                        this.getTaskRelatives();
                    })
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
            showIssueForm: function () {
                this.$store.commit('TASK_STORE/SET_TASK_ISSUE_FORM', {id: 0});
                this.$store.commit('TASK_STORE/SET_SHOW_ISSUE_FORM', true);
            },
            showRelativeForm: function () {
                this.$store.commit('TASK_STORE/SET_SHOW_RELATIVE_FORM', true);
            }
        }
    }
</script>

<style scoped>

</style>