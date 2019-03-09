<template>
    <div class="elevation-5">
        <v-toolbar flat color="white">
            <v-toolbar-title>QUẢN LÝ NHÂN VIÊN</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn @click="refresh">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="showForm">Tạo mới nhân viên</v-btn>
            <UserForm @refresh="refresh"></UserForm>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="users"
                :loading="table.loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                rows-per-page-text="Số hàng mỗi trang"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                must-sort
        >
            <v-progress-linear #progress color="blue" indeterminate></v-progress-linear>
            <template #items="props">
                <router-link tag="tr" :to="`users/${props.item.id}`"
                             onmouseover="this.style.cursor='pointer'"
                             onmouseout="this.style.cursor='none'"
                >
                    <td class="text-xs-left">{{props.item.displayName}}</td>
                    <td class="text-xs-left">{{props.item.createdTime}}</td>
                    <td class="text-xs-left">{{props.item.fullName}}</td>
                    <td class="text-xs-left">{{props.item.email}}</td>
                    <td class="text-xs-left">{{props.item.department.name}}</td>
                    <td v-if="isAdmin" class="text-xs-left">{{props.item.role.name}}</td>
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex';
    import {mapGetters} from 'vuex';
    import UserForm from "@/components/users/UserForm";

    export default {
        name: "UserTable",
        components: {UserForm},
        data() {
            return {
                canLoadData: false,
                alert: '',
                pagination: {
                    sortBy: 'displayName',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tên hiển thị', value: 'displayName'},
                        {text: 'Ngày tạo', value: 'createdTime'},
                        {text: 'Tên đầy đủ', value: 'fullName'},
                        {text: 'Email', value: 'email'},
                        {text: 'Phòng ban', value: 'department.name'},
                        {text: 'Chức vụ', value: 'role.name'},
                    ]
                },
            }
        },
        computed: {
            ...mapState('USER_STORE', {
                users: 'users'
            }),
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin'
            })
        },
        methods: {
            refresh() {
                this.pagination.page = 1;
                this.pagination.sortBy = 'displayName';
                this.pagination.descending = true;
                //this.canLoadData = false;
                this.getUsers();
            },
            showForm: function () {
                this.$store.commit('USER_STORE/SET_USER_FORM', {id: 0, department: {}, role: {}});
                this.$store.commit('USER_STORE/SET_SHOW_FORM', true);
            },
            getUsers() {
                if (!this.canLoadData) {
                    this.canLoadData = true;
                    return;
                }
                console.log(this.isAdmin)
                this.table.loading = true;
                const url = this.isAdmin ?
                    `http://localhost:8080/users/search/all` :
                    `http://localhost:8080/users/findAllStaffSummaryByDepartmentOfCurrentLoggedManager`;

                axios.get(url,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.$store.commit('USER_STORE/SET_USERS', []);
                            this.pagination.totalItems = 0;
                        } else {
                            this.$store.commit('USER_STORE/SET_USERS', response.data.content);
                            this.pagination.totalItems = response.data.totalElements;
                        }
                        this.table.loading = false;
                        console.log(response.data.content);
                    }
                ).catch(error => {
                        this.alert = 'Không thể truy cập';
                        if (error.response) {
                            console.log(error.response.data)
                        }
                        this.table.loading = false;
                    }
                );
            },
        },
        mounted() {
            this.$nextTick(() => {
                this.getUsers();

            })
        },
        watch: {
            pagination: function () {
                this.getUsers();
            }
        },
    }
</script>

<style scoped>

</style>