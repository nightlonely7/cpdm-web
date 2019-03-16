<template>
    <div class="elevation-5">
        <v-toolbar flat color="white">
            <v-toolbar-title>QUẢN LÝ ĐƠN XIN NGHỈ</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="userLeaveRequests"
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
                <router-link tag="tr" onmouseover="this.style.cursor='pointer'"
                             onmouseout="this.style.cursor='none'"
                >
                    <td class="text-xs-left">{{props.item.content}}</td>
                    <td class="text-xs-left">{{props.item.fromDate}}</td>
                    <td class="text-xs-left">{{props.item.toDate}}</td>
                    <td class="text-xs-left">{{props.item.createdDate}}</td>
                    <td class="text-xs-left">{{props.item.approver.displayName}}</td>
                    <td class="text-xs-left">{{props.item.status}}</td>
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import {mapState} from 'vuex'

    export default {
        name: "UserLeaveRequestTable",
        data() {
            return {
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Ngày bắt đầu', value: 'fromDate'},
                        {text: 'Ngày kết thúc', value: 'ToDate'},
                        {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Người xét duyệt', value: 'approver.displayName'},
                        {text: 'Trạng thái', value: 'status'},
                    ]
                },
            }
        },
        computed: {
            ...mapState('LEAVE_REQUEST_STORE', {
                userLeaveRequests: state => state.userLeaveRequests,
            }),
            ...mapState('AUTHENTICATION', {
                isLoggedIn: state => state.isLoggedIn,
                isStaff: state => state.isStaff,
                isAdmin: state => state.isAdmin,
            })
        },
        methods: {
            getUserLeveRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/tasks/findByCurrentLoggedCreator`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.$store.commit('LEAVE_REQUEST_STORE/SET_USER_LEAVE_REQUESTS', []);
                            this.pagination.totalItems = 0;
                        } else {
                            this.$store.commit('LEAVE_REQUEST_STORE/SET_USER_LEAVE_REQUESTS', response.data.content);
                            this.pagination.totalItems = response.data.totalElements;
                        }
                        this.table.loading = false;
                    }
                ).catch(error => {
                        this.table.loading = false;
                        this.alert = 'Không thể truy cập';
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
        },
        watch: {
            pagination: function () {
                this.getUserLeveRequests();
            }
        }
    }
</script>

<style scoped>

</style>