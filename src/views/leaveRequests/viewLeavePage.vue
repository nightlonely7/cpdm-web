<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">LỊCH NGHỈ PHÉP</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-menu
                    v-model="fromDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                            v-model="fromDate"
                            label="Ngày bắt đầu"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="fromDate"
                               @input="fromDateMenu = false"></v-date-picker>
            </v-menu>
            <v-menu
                    v-model="toDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                            v-model="toDate"
                            label="Ngày kết thúc"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="toDate"
                               @input="toDateMenu = false"></v-date-picker>
            </v-menu>
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
            <template v-slot:items="props">
                <td class="text-xs-left" @click="showLeaves(props)">{{props.item.displayName}}</td>
            </template>
            <template v-for=" (leaveRequest,index) in userLeaveRequests" v-slot:expand="props">
                <tr :key="index" flat>
                    <td class="text-xs-left"></td>
                    <td class="text-xs-left">{{leaveRequest.content}}</td>
                    <td class="text-xs-left">{{leaveRequest.fromDate}}</td>
                    <td class="text-xs-left">{{leaveRequest.toDate}}</td>
                    <td class="text-xs-left">{{leaveRequest.approver.displayName}}</td>
                    <td class="text-xs-left">{{leaveRequest.status === 0 ? "Chờ xét duyệt" : "Đã duyệt"}}</td>
                </tr>
            </template>
        </v-data-table>

        <!--Snack bar-->
        <v-snackbar v-model="snackbar" right>
            {{snackBarText}}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "viewLeavePage",
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                fromDateMenu: false,
                toDateMenu: false,
                fromDate: new Date().toISOString().substr(0, 10),
                toDate: new Date().toISOString().substr(0, 10),
                users: [],
                userLeaveRequests: [],
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'displayName',
                    descending: false
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tên', value: 'displayName'},
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Ngày bắt đầu', value: 'fromDate'},
                        {text: 'Ngày kết thúc', value: 'toDate'},
                        {text: 'Người xét duyệt', value: 'approver.displayName'},
                        {text: 'Trạng thái', value: 'status'},
                    ]
                },
            }
        },
        mounted() {
            this.$nextTick()
            {
                this.getUserForAdmin();
            }
        },
        methods: {
            getUsersForAdmin: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/users/search/all`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.users = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.users = response.data.content;
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
            refresh() {
                this.getUsersForAdmin();
            },
            getUserLeveRequests: function (userId) {
                this.table.loading = true;
                axios.get(`http://localhost:8080/leaveRequests/findByUserAndDateRange`,
                    {
                        params: {
                            fromDate: this.fromDate,
                            toDate: this.toDate,
                            userId: userId,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.userLeaveRequests = [];
                        } else {
                            this.userLeaveRequests = response.data;
                        }
                        console.log(this.userLeaveRequests);
                        this.table.loading = false;
                    }
                ).catch(error => {
                        this.table.loading = false;
                        if (error.response) {
                            console.log(error.response.data)
                        }
                        this.snackbar = true;
                        this.snackBarText = "Thất bại";
                    }
                );
            },
            showLeaves(props) {
                props.expanded = !props.expanded;
                if (props.expanded) {
                    this.getUserLeveRequests(props.item.id);
                } else {
                    this.userLeaveRequests = [];
                }
            }
        },
        watch: {
            pagination: function () {
                this.getUsersForAdmin();
            }
        }
    }

</script>

<style scoped>

</style>