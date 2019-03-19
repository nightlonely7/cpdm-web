<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Thêm mới</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">ĐƠN XIN NGHỈ PHÉP</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-model="editItem.content" label="Nội dung"></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm4 md4>
                                    <v-select
                                            v-model="editItem.approver"
                                            :items="approvers"
                                            item-text="displayName"
                                            name="approver"
                                            label="Người xét duyệt"
                                            return-object
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm4 md4>
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
                                                    v-model="editItem.fromDate"
                                                    label="Ngày bắt đầu"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="editItem.fromDate"
                                                       @input="fromDateMenu = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 sm4 md4>
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
                                                    v-model="editItem.toDate"
                                                    label="Ngày kết thúc"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="editItem.toDate"
                                                       @input="toDateMenu = false"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">ĐÓNG</v-btn>
                        <v-btn color="blue darken-1" flat @click="save">LƯU</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
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
                <td class="text-xs-left">{{props.item.content}}</td>
                <td class="text-xs-left">{{props.item.fromDate}}</td>
                <td class="text-xs-left">{{props.item.toDate}}</td>
                <td class="text-xs-left">{{props.item.createdDate}}</td>
                <td class="text-xs-left">{{props.item.approver.displayName}}</td>
                <td class="text-xs-left" v-if="props.item.status === 0">
                    <v-card-actions>
                        <v-btn outline fab small color="indigo" @click="editLeaveRequest(props.item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn outline fab small color="red" @click="deleteLeaveRequest(props.item.id)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </v-card-actions>
                </td>
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
    import axios from 'axios';
    import {mapGetters, mapState} from "vuex";

    export default {
        name: "UserLeaveRequestTable",
        props:{
            type: String,
        },
        data(){
            return {
                snackbar: false,
                snackBarText: '',
                title: '',
                status: 0,
                dialog: false,
                defaultItem: {
                    id: 0,
                    content: '',
                    fromDate: new Date().toISOString().substr(0, 10),
                    toDate: new Date().toISOString().substr(0, 10),
                    user: {},
                    approver: {},
                    status: 0
                },
                editItem: {
                    id: 0,
                    content: '',
                    fromDate: new Date().toISOString().substr(0, 10),
                    toDate: new Date().toISOString().substr(0, 10),
                    user: {},
                    approver: {},
                    status: 0
                },
                fromDateMenu: false,
                toDateMenu: false,
                createdDateMenu: false,
                userLeaveRequests: [],
                approvers: [],
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'createdDate',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Ngày bắt đầu', value: 'fromDate'},
                        {text: 'Ngày kết thúc', value: 'toDate'},
                        {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Người xét duyệt', value: 'approver.displayName'},
                    ]
                },
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                role: state => state.role,
            }),
            ...mapGetters('AUTHENTICATION', {
                isInit: 'isInit',
                isLoggedIn: 'isLoggedIn',
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            }),
        },
        mounted() {
            this.$nextTick(function () {
                switch (this.type) {
                    case 'waiting':
                        this.title = 'ĐƠN ĐANG CHỜ';
                        this.status = 0;
                        this.table.headers.push({text: 'Thao tác', value: 'status'});
                        break;
                    case 'approved':
                        this.title = 'ĐƠN ĐÃ DUYỆT';
                        this.status = 1;
                        break;
                }
                this.getUserLeveRequests();
                this.getApprovers();
            })
        },
        methods: {
            getApprovers: function () {
                var roleName = "ROLE_MANAGER";
                if(!this.isStaff){
                    roleName = "ROLE_ADMIN";
                }
                axios.get(`http://localhost:8080/users/findAllfDisplayNameByDepartmentAndRoleNameOfCurrentLoggedManager`,
                    {
                        params: {
                            roleName: roleName
                        }
                    }
                ).then(response => {
                        this.approvers = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            getUserLeveRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/leaveRequests/findByUser`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            status: this.status
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.userLeaveRequests = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.userLeaveRequests = response.data.content;
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
                this.getUserLeveRequests();
            },
            deleteLeaveRequest(id) {
                if (confirm('Bạn muốn xóa đơn này?')) {
                    axios.delete(`http://localhost:8080/leaveRequests/` + id)
                        .then(() => {
                                this.getUserLeveRequests();
                                this.snackbar = true;
                                this.snackBarText = "Thành công";
                            }
                        ).catch(error => {
                            if (error.response) {
                                console.log(error.response.data)
                            }
                            if (error.response.status === 405) {
                                this.snackbar = true;
                                this.snackBarText = "Không thể xóa đơn đã duyệt";
                            } else {
                                this.snackbar = true;
                                this.snackBarText = "Thất bại";
                            }

                        }
                    );
                }
            },
            editLeaveRequest(item) {
                this.editItem = item;
                this.dialog = true;
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editItem = Object.assign({}, this.defaultItem)
                }, 300)
            },
            save() {

                var url = `http://localhost:8080/leaveRequests`;
                var method = 'POST';

                if (this.editItem.id != 0) {
                    url = `http://localhost:8080/leaveRequests/` + this.editItem.id;
                    method = 'PUT';
                }

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.editItem
                    }
                ).then((response) => {
                        this.close();
                        this.getUserLeveRequests();
                        if (response.status == 405) {
                            this.snackBarText = 'Không thể chỉnh sửa đơn đã duyệt';
                            this.snackbar = true;
                        } else {
                            this.snackBarText = 'Thành công';
                            this.snackbar = true;
                        }
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                        this.snackBarText = 'Thất bại';
                        this.snackbar = true;
                    }
                );
            }
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