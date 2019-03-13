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
            <span>Tỉ lệ hoàn thành:&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span>
            <v-progress-circular :value="completionRate * 100" size="64" rotate="180" width="12" color="primary">
                <span style="color: black">{{completionRate * 100}}%</span>
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
                        <template v-for="user in task.relatives">
                            <v-list-tile>
                                {{user.displayName}} - {{user.fullName}} - {{user.email}} -
                                Phòng ban: {{user.department.name || ''}} -
                                Chức vụ: {{user.role.name || ''}}
                            </v-list-tile>
                        </template>
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
                        <template v-for="issue in task.issues">
                            <v-list-tile>
                                {{issue.summary}} - {{issue.detail}} - {{issue.weight}}
                            </v-list-tile>
                        </template>
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
    </div>
</template>

<script>
    import axios from 'axios'
    import TaskForm from "@/components/tasks/TaskForm";
    import {mapState} from 'vuex'

    export default {
        name: "TaskDetail",
        components: {TaskForm},
        props: {
            id: Number
        },
        data() {
            return {
                task: {
                    creator: {},
                    executor: {},
                },
            }
        },
        computed: {
            completionRate: function () {
                let totalWeight = 0;
                let totalComplete = 0;
                if (this.task.issues) {
                    this.task.issues.forEach(function (issue) {
                        console.log(issue);
                        totalWeight += issue.weight;
                        if (issue.status === 'completed') {
                            totalComplete += issue.weight;
                        }
                    });
                }
                return totalComplete === 0 ? 0 : totalComplete / totalWeight;
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getTask();
            })
        },
        methods: {
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
                            this.task = response.data;
                        }
                    )
            },
            deleteTask: function () {
                if (confirm('Xóa?')) {
                    axios.delete(`http://localhost:8080/tasks/${this.id}`)
                        .then(() => {
                                this.$router.push("/tasks");
                            }
                        )
                }
            }
        }
    }
</script>

<style scoped>

</style>