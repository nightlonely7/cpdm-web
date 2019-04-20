<template>
    <div>
        <h2>Tên hiển thị: {{user.displayName}}</h2>
        <v-divider></v-divider>
        <br>
        <h4>Tên đầy đủ: {{user.fullName || 'Chưa xác định'}}</h4>
        <br>
        <h4>Email: <span style="color: red">{{user.email}}</span></h4>
        <br>
        <p style="color: blue">Ngày tạo: {{user.createdTime}}</p>
        <p style="color: blue">Số điện thoại: {{user.phone || 'Chưa xác định'}}</p>
        <p style="color: blue">Địa chỉ: {{user.address || 'Chưa xác định'}}</p>
        <p style="color: blue">Ngày sinh: {{user.birthday || 'Chưa xác định'}}</p>
        <p style="color: blue">Giới tính: {{user.gender ? 'Nam' : 'Nữ' || 'Chưa xác định'}}</p>
        <p style="color: blue">Tuổi: {{user.age || 'Chưa xác định'}}</p>
        <p style="color: blue">Phòng ban: {{user.department.name}}</p>
        <p style="color: blue">Chức vụ: {{user.role.name}}</p>
        <br>
        <v-divider></v-divider>
        <UserForm :userForm="{...user}">
            <template #activator="{on}">
                <v-btn v-on="on" color="primary">Sửa</v-btn>
            </template>
        </UserForm>
        <v-btn @click="deleteUser" color="error">Xóa</v-btn>
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
                                this.$router.push("/users");
                            }
                        )
                }
            }
        }

    }
</script>

<style scoped>

</style>