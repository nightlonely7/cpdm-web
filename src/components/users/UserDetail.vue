<template>
    <div>
        <h2>Tên hiển thị: {{user.displayName}}</h2>
        <v-divider></v-divider>
        <br>
        <h4>Tên đầy đủ: {{user.fullName}}</h4>
        <br>
        <h4>Email: {{user.email}}</h4>
        <p>Số điện thoại: {{user.phone}}</p>
        <p>Địa chỉ: {{user.address}}</p
        <p>Ngày sinh: {{user.birthday}}</p>
        <p>Tuổi: {{user.age}}</p>
        <p>Phòng ban: {{user.department.name}}</p>
        <p>Chức vụ: {{user.role.name}}</p>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "UserDetail",
        data() {
            return {
                user: {department: {}},
            }
        },
        props: {
            id: Number,
        },
        mounted() {
            this.$nextTick(function () {
                this.getUser();
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
            getUser: function () {
                axios.get(`http://localhost:8080/users/${this.id}`)
                    .then(response => {
                        this.user = response.data;
                    }
                )
            },
            deleteTask: function () {
                if (confirm('Xóa?')) {
                    axios.delete(`http://localhost:8080/tasks/${this.id}`, {
                            headers: {'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGFuaG5wQGdtYWlsLmNvbSIsImV4cCI6MTU1MjUzMTM1MH0.9xhabQG_oKgDuwmH-w8YSGyrDoUjPCGSVzeColLY4xG2zJl9EBUNeNQJrwlM0rIaydXH1RbIHYm2LPk7yfJDKw'}
                        }
                    ).then(() => {
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