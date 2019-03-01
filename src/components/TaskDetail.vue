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
        <v-btn @click="dialog = true">
            Sửa
        </v-btn>
        <TaskForm :activate="dialog" @close="dialog = false" @refresh="getTask" :current-task="task"></TaskForm>
    </div>
</template>

<script>
    import axios from 'axios'
    import TaskForm from "@/components/TaskForm";

    export default {
        name: "TaskDetail",
        components: {TaskForm},
        data() {
            return {
                dialog: false,
                task: {
                    id: 0,
                    title: '',
                    summary: '',
                    description: '',
                    creator: {id: 0, displayName: ''},
                    executor: {id: 0, displayName: ''},
                    createdTime: '',
                    startTime: '',
                    endTime: '',
                    priority: 0,
                    status: ''
                }
            }
        },
        props: {
            id: Number
        },
        mounted() {
            this.$nextTick(function () {
                this.getTask();
            })
        },
        methods: {
            getTask: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}`,
                    {
                        headers: {'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGFuaG5wQGdtYWlsLmNvbSIsImV4cCI6MTU1MTYxMTA5N30.uKQtiMqFMbG0NFaGkRmReHdKdj3OP8rK7J8KfUeDEGEqTu0JHop-ZBBir1067I57pV7eOzes8sY3w7pW6xe6Kg'}
                    }
                ).then(response => {
                    this.task = response.data
                })
            },
            deleteTask: function () {
                if (confirm('Xóa?')) {
                    axios.delete(`http://localhost:8080/tasks/${this.id}`, {
                        headers: {'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGFuaG5wQGdtYWlsLmNvbSIsImV4cCI6MTU1MTYxMTA5N30.uKQtiMqFMbG0NFaGkRmReHdKdj3OP8rK7J8KfUeDEGEqTu0JHop-ZBBir1067I57pV7eOzes8sY3w7pW6xe6Kg'}
                    }).then(
                        response => {
                            console.log(response.status);
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