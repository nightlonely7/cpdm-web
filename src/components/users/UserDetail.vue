<template>
    <div>
        <v-card-text>
            <p>
                <span style="width: 25%; float: left">Tên hiển thị</span>
                <span style="width: 75%; float: left"><b>{{user.displayName || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br/>
            <p>
                <span style="width: 25%; float: left">Tên đầy đủ</span>
                <span style="width: 75%; float: left"><b>{{user.fullName || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Email</span>
                <span style="width: 75%; float: left"><b>{{user.email || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <!--<p>-->
                <!--<span style="width: 25%; float: left">Ngày tạo</span>-->
                <!--<span style="width: 75%; float: left"><b>{{user.createdTime || 'Chưa xác định'}}</b></span>-->
            <!--</p>-->
            <!--<br>-->
            <!--<v-divider></v-divider>-->
            <!--<br>-->
            <p>
                <span style="width: 25%; float: left">Số điện thoại</span>
                <span style="width: 75%; float: left"><b>{{user.phone || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Địa chỉ</span>
                <span style="width: 75%; float: left"><b>{{user.address || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Ngày sinh</span>
                <span style="width: 75%; float: left"><b>{{user.birthday || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Giới tính</span>
                <span style="width: 75%; float: left"><b>{{user.gender ? 'Nam' : 'Nữ' || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Tuổi</span>
                <span style="width: 75%; float: left"><b>{{user.age || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Phòng ban</span>
                <span style="width: 75%; float: left"><b>{{user.department.name || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Chức vụ</span>
                <span style="width: 75%; float: left"><b>{{user.role.name || 'Chưa xác định'}}</b></span>
            </p>
        </v-card-text>
        <br/>
        <br>
        <v-divider></v-divider>
        <v-layout row>
            <UserForm :userForm="{...user}" @refresh="getUser" :current-email="user.email">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Chỉnh Sửa</v-btn>
                </template>
            </UserForm>
            <v-btn @click="deleteUser" color="error">Xóa</v-btn>
        </v-layout>
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
                user: {
                    email: '',
                    department: {},
                    role: {}
                },
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