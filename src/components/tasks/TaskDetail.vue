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
        computed: {
            ...mapState('TASK_STORE', {
                task: state => state.task
            })
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
                        this.$store.commit('TASK_STORE/SET_TASK', response.data);
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