<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">THEO DÕI NGHỈ PHÉP</v-toolbar-title>
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
                <tr @click="showLeaves(props)">
                    <td class="text-xs-left">{{props.item.displayName}}</td>
                    <td class="text-xs-left">{{props.item.fullName}}</td>
                    <td class="text-xs-left">{{props.item.email}}</td>
                    <td class="text-xs-left">{{props.item.department.name}}</td>
                    <td class="text-xs-left">{{props.item.role.name}}</td>
                </tr>
            </template>
            <template v-slot:expand="props">
                <v-data-table :headers="subTable.headers"
                              :items="userLeaveRequests"
                              :loading="subTable.loading"
                              :no-data-text="alert || 'Không có dữ liệu'"
                              :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                              hide-actions
                              :pagination.sync="subPagination"
                              must-sort>
                    <v-progress-linear #progress color="blue" indeterminate></v-progress-linear>
                    <template v-slot:items="props">
                        <tr>
                            <td class="text-xs-left"></td>
                            <td class="text-xs-left">{{props.item.content}}</td>
                            <td class="text-xs-left">{{props.item.fromDate}}</td>
                            <td class="text-xs-left">{{props.item.toDate}}</td>
                            <td class="text-xs-left">{{props.item.createdDate}}</td>
                            <td class="text-xs-left">{{props.item.approver.displayName}}</td>
                            <td class="text-xs-left">{{props.item.status === 0 ? "Chờ xét duyệt" : "Đã duyệt"}}</td>
                        </tr>
                    </template>
                </v-data-table>
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
        name: "ViewUserLeavePage",
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                fromDateMenu: false,
                toDateMenu: false,
                fromDate: new Date().toISOString().substr(0, 10),
                toDate: new Date().toISOString().substr(0, 10),
                users: [],
                userId: null,
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
                        {text: 'Tên hiển thị', value: 'content'},
                        {text: 'Tên đầy đủ', value: 'content'},
                        {text: 'Email', value: 'content'},
                        {text: 'Phòng ban', value: 'content'},
                        {text: 'Chức vụ', value: 'content'},
                    ]
                },
                subPagination: {
                    sortBy: 'fromDate',
                    descending: false,
                    rowsPerPage: -1
                },
                subTable: {
                    loading : false,
                    headers: [
                        {text: '', sortable: false},
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Ngày bắt đầu', value: 'fromDate'},
                        {text: 'Ngày kết thúc', value: 'toDate'},
                        {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Người xét duyệt', value: 'approver.displayName'},
                        {text: 'Trạng thái', value: 'status'},
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick()
            {
                this.getUsersForAdmin();
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
                if(this.userId != null){
                    this.getUserLeveRequests(this.userId);
                }
            },
            getUserLeveRequests: function (userId) {
                this.table.loading = true;
                axios.get(`http://localhost:8080/leaveRequests/search/findByUserAndDateRange`,
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
                    this.userId = props.item.id;
                } else {
                    this.userLeaveRequests = [];
                    this.userId = null;
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