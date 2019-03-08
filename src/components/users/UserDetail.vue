<template>
    <div>
        <h2>Tên hiển thị: {{user.displayName}}</h2>
        <v-divider></v-divider>
        <br>
        <h4>Tên đầy đủ: {{user.fullName || 'Chưa xác định'}}</h4>
        <br>
        <h4>Email: <span style="color: red">{{user.email}}</span></h4>
        <br>
        <p>Ngày tạo: {{user.createdTime}}</p>
        <p>Số điện thoại: {{user.phone || 'Chưa xác định'}}</p>
        <p>Địa chỉ: {{user.address || 'Chưa xác định'}}</p>
        <p>Ngày sinh: {{user.birthday || 'Chưa xác định'}}</p>
        <p>Tuổi: {{user.age || 'Chưa xác định'}}</p>
        <p>Phòng ban: {{user.department.name}}</p>
        <p>Chức vụ: {{user.role.name}}</p>
        <br>
        <v-divider></v-divider>
        <v-btn @click="showForm">Sửa email</v-btn>
        <v-btn @click="deleteUser">Xóa nhân viên</v-btn>
        <UserForm @refresh="getUser"></UserForm>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import UserForm from "@/components/users/UserForm";

    export default {
        name: "UserDetail",
        components: {UserForm},
        data() {
            return {
                user: {department: {}, role: {}},
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
                this.$store.commit('USER_STORE/SET_SHOW_FORM', true);
                const userForm = {
                    id: this.user.id,
                    email: this.user.email,
                };
                this.$store.commit('TASK_STORE/SET_USER_FORM', userForm);
            },
            getUser: function () {
                axios.get(`http://localhost:8080/users/${this.id}`)
                    .then(response => {
                            this.user = response.data;
                            this.user.age = moment().diff(response.data.birthday, 'years');
                            if (this.user.birthday && this.user.birthday.length) {
                                this.user.birthday = moment(this.user.birthday).format("DD-MM-YYYY")
                            }
                        }
                    )
            },
            deleteUser: function () {
                if (confirm('Bạn muốn xóa nhân viên này chứ?')) {
                    axios.delete(`http://localhost:8080/users/${this.id}`)
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