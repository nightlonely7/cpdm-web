<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">THEO DÕI NGHỈ PHÉP</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-flex xs3>
                <v-select
                        v-model="year"
                        :items="years"
                        prepend-icon="event"
                        label="Năm"
                ></v-select>
            </v-flex>
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
                    <td class="text-xs-left">{{props.item.role.displayName}}</td>
                </tr>
            </template>
            <template v-slot:expand="props">
                <v-layout row>
                    <v-subheader>Thông tin tóm tắt</v-subheader>
                </v-layout>
                <v-layout row>
                    <v-flex xs1/>
                    <v-flex xs4>
                        <v-subheader>Số ngày nghỉ tối đa một năm</v-subheader>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field v-text="userYearLeaveSummary.dayOffPerYear"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs1/>
                    <v-flex xs4>
                        <v-subheader>Số ngày nghỉ đã sử dụng trong năm</v-subheader>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field v-text="userYearLeaveSummary.dayOffApproved"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs1/>
                    <v-flex xs4>
                        <v-subheader>Số ngày nghỉ còn lại trong năm</v-subheader>
                    </v-flex>
                    <v-flex xs3>
                        <v-text-field v-text="userYearLeaveSummary.dayOffRemain"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-subheader>Thông tin chi tiết</v-subheader>
                </v-layout>
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
                            <td class="text-xs-left">{{props.item.content | truncate(30)}}</td>
                            <td class="text-xs-left">{{props.item.dayOff}}</td>
                            <td class="text-xs-left">{{props.item.fromDate}}</td>
                            <td class="text-xs-left">{{props.item.toDate}}</td>
                            <!--<td class="text-xs-left">{{props.item.createdDate}}</td>-->
                            <td class="text-xs-left">{{props.item.approver.displayName}}</td>
                            <td class="text-xs-left">
                                <v-card-actions>
                                    <v-dialog v-model="dialog" max-width="500px">
                                        <template v-slot:activator="{ on }">
                                            <v-btn outline fab small color="indigo" v-on="on">
                                                <v-icon>info</v-icon>
                                            </v-btn>
                                        </template>
                                        <v-card>
                                            <v-card-title>
                                                <span class="headline">ĐƠN XIN NGHỈ PHÉP</span>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-container grid-list-md>
                                                    <v-layout wrap>
                                                        <v-flex xs12 sm12 md12>
                                                            <v-textarea
                                                                    v-model="props.item.content"
                                                                    label="Nội dung"
                                                                    readonly
                                                                    counter
                                                                    maxlength="255"
                                                            ></v-textarea>
                                                        </v-flex>
                                                        <v-flex xs12 sm4 md4>
                                                            <v-text-field
                                                                    v-model="props.item.user.displayName"
                                                                    label="Người tạo"
                                                                    readonly
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm4 md4>
                                                            <v-text-field
                                                                    v-model="props.item.approver.displayName"
                                                                    label="Người xét duyệt"
                                                                    readonly
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm4 md4>
                                                            <v-text-field
                                                                    v-model="props.item.createdDate"
                                                                    label="Ngày tạo"
                                                                    prepend-icon="event"
                                                                    readonly
                                                                    v-on="on"
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm4 md4>
                                                            <v-text-field
                                                                    v-model="props.item.dayOff"
                                                                    label="Số ngày nghỉ"
                                                                    readonly
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm4 md4>
                                                            <v-text-field
                                                                    v-model="props.item.fromDate"
                                                                    label="Ngày bắt đầu"
                                                                    prepend-icon="event"
                                                                    readonly
                                                            ></v-text-field>
                                                        </v-flex>
                                                        <v-flex xs12 sm4 md4>
                                                            <v-text-field
                                                                    v-model="props.item.toDate"
                                                                    label="Ngày kết thúc"
                                                                    prepend-icon="event"
                                                                    readonly
                                                            ></v-text-field>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-container>
                                            </v-card-text>

                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="blue darken-1" flat @click="close">ĐÓNG</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-card-actions>
                            </td>
                            <!--<td class="text-xs-left">{{props.item.status === 0 ? "Chờ xét duyệt" : "Đã duyệt"}}</td>-->
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
                dialog: false,
                on: false,
                snackbar: false,
                snackBarText: '',
                years: [],
                year: new Date().toISOString().substr(0, 4),
                users: [],
                userId: null,
                userLeaveRequests: [],
                userYearLeaveSummary: {
                    dayOffPerYear: 12,
                    dayOffApproved: 0,
                    dayOffRemain: 12,
                },
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'displayName',
                    descending: false
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tên hiển thị', value: 'displayName'},
                        {text: 'Tên đầy đủ', value: 'fullName'},
                        {text: 'Email', value: 'email'},
                        {text: 'Phòng ban', value: 'department.name'},
                        {text: 'Chức vụ', value: 'role.displayName'},
                    ]
                },
                subPagination: {
                    sortBy: 'fromDate',
                    descending: true,
                    rowsPerPage: -1
                },
                subTable: {
                    loading: false,
                    headers: [
                        {text: '', sortable: false},
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Số ngày nghỉ', value: 'dayOff'},
                        {text: 'Ngày bắt đầu', value: 'fromDate'},
                        {text: 'Ngày kết thúc', value: 'toDate'},
                        // {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Người xét duyệt', value: 'approver.displayName'},
                        {text: 'Chi tiết', value: 'status'},
                        // {text: 'Trạng thái', value: 'status'},
                    ]
                }
            }
        },
        mounted() {
            this.$nextTick()
            {
                this.getUsersForAdmin();
                this.getYearSelectPicker();
            }
        },
        methods: {
            getUsersForAdmin: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/users/search/staff-and-manager`,
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
            getYearSelectPicker() {
                axios.get(`http://localhost:8080/leaveRequests/search/year`
                ).then(response => {
                        this.years = response.data;
                    }
                ).catch(error => {
                    console.log(error);
                });
            },
            refresh() {
                this.getUsersForAdmin();
                if (this.userId != null) {
                    this.getUserLeveRequests(this.userId);
                }
            },
            getUserLeveRequests: function (userId) {
                this.table.loading = true;
                axios.get(`http://localhost:8080/leaveRequests/search/findYearSummary`,
                    {
                        params: {
                            userId: userId,
                            year: this.year
                        }
                    }
                ).then(response => {
                        this.userYearLeaveSummary.dayOffPerYear = response.data.dayOffPerYear;
                        this.userYearLeaveSummary.dayOffApproved = response.data.dayOffApproved;
                        this.userYearLeaveSummary.dayOffRemain = response.data.dayOffRemain;
                        this.userLeaveRequests = response.data.leaveRequestSummaries;
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
            },
            save(date) {
                this.year = date.substr(0, 4);
                this.$refs.menu.save(date);
                this.$refs.picker.activePicker = 'YEAR';
                this.menu = false;
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editItem = Object.assign({}, this.defaultItem)
                }, 300)
            },
            setYear() {
                console.log(this.date);
                this.date = new Date().setFullYear(this.year, 1, 1);
                console.log(this.date);
            }
        },
        watch: {
            pagination: function () {
                this.getUsersForAdmin();
            },
            year: function () {
                this.refresh()
            },
        }
    }

</script>

<style scoped>

</style>