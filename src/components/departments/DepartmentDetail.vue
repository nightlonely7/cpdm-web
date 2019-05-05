<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
        <v-card-text>
            <p>
                <span style="width: 25%; float: left">Tên phòng ban</span>
                <span style="width: 75%; float: left"><b>{{department.name || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Mã phòng ban</span>
                <span style="width: 75%; float: left"><b>{{department.alias || 'Chưa xác định'}}</b></span>
            </p>
        </v-card-text>
        <br/>
        <v-card>
            <v-card-title>Nội dung chi tiết</v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                {{department.description || 'Chưa xác định'}}
            </v-card-text>
        </v-card>
        <br/>
        <v-list three-line class="elevation-1">
            <v-subheader>
                <h4>Quản lý</h4>
            </v-subheader>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-list-tile
                    v-for="user in users"
                    :key="user.id"
                    v-if="user.role.name === 'ROLE_MANAGER'"
            >
                <v-list-tile-content>
                    <router-link :to="`/users/${user.id}`">
                        <v-list-tile-title>
                            Tên hiển thị: {{user.displayName}}
                        </v-list-tile-title>
                    </router-link>
                    <v-list-tile-sub-title>
                        Tên đầy đủ: {{user.fullName}}
                    </v-list-tile-sub-title>
                    <v-list-tile-sub-title>
                        Email: {{user.email}}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-else-if="users.length === 0">
                <v-list-tile-content>
                    <v-list-tile-title>
                        Không có quản lí trong danh sách này!
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-subheader>
                <h4>Danh sách nhân viên</h4>
            </v-subheader>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-list-tile
                    v-for="user in users"
                    :key="user.id"
                    v-if="user.role.name === 'ROLE_STAFF'"
            >
                <v-list-tile-content>
                    <router-link :to="`/users/${user.id}`">
                        <v-list-tile-title>
                            Tên: {{user.displayName}}
                        </v-list-tile-title>
                        <v-list-tile-sub-title>
                            Tên đầy đủ: {{user.fullName}}
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title>
                            Email: {{user.email}}
                        </v-list-tile-sub-title>
                    </router-link>
                </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-else-if="users.length === 0">
                <v-list-tile-content>
                    <v-list-tile-title>
                        Không có nhân viên trong danh sách này!
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <DepartmentForm :department-form="{...department}" @refresh="getDepartmentDetail(id)"
                        :department-name="department.name" :department-alias="department.alias">
            <template #activator="{on}">
                <v-btn v-on="on" color="primary">Sửa</v-btn>
            </template>
        </DepartmentForm>
        <v-btn @click="deleteDepartment" color="error">Xóa</v-btn>
        <br/>
    </div>
</template>

<script>
    import axios from 'axios';
    import DepartmentForm from "./DepartmentForm";

    export default {
        name: "DepartmentDetail",
        components: {DepartmentForm},
        data() {
            return {
                department: {
                    id: 0,
                    name: '',
                    alias: '',
                    description: ''
                },
                users: []
            }
        },
        props: {
            id: Number
        },
        mounted() {
            this.getDepartmentDetail(this.id);
        },
        computed: {},
        methods: {
            getDepartmentDetail: async function (id) {
                await axios.get(`http://localhost:8080/departments/${id}`)
                    .then(
                        response => {
                            this.department = response.data;
                            this.getRelatedUserList(id);
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            },
            getRelatedUserList: async function (id) {
                await axios.get(`http://localhost:8080/users/findAllSummaryByDepartmentId/${id}`)
                    .then(
                        response => {
                            this.users = response.data;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    )
            },
            deleteDepartment: function () {
                if (confirm('Xóa phòng ban?')) {
                    axios.delete(`http://localhost:8080/departments/${this.department.id}`)
                        .then(
                            () => {
                                this.$router.push("/departments");
                            }
                        )
                }
            },
            goBack: function () {
                this.$router.push('/departments');
            }
        },
    }
</script>

<style scoped>

</style>
