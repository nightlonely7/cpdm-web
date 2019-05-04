<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="dialog" v-if="status===0">
                    <v-btn color="primary" dark class="mb-2" v-on="dialog" @click="setDialog">Thêm mới</v-btn>
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
                                            ref="txtContent"
                                            v-model="editItem.content"
                                            label="Nội dung"
                                            :rules="[rules.required,rules.max]"
                                            clearable
                                            counter
                                            maxlength="255"
                                    ></v-textarea>
                                </v-flex>
                                <v-flex xs12 sm4 md4>
                                    <v-text-field
                                            v-model="editItem.approver.displayName"
                                            label="Người xét duyệt"
                                            readonly
                                    ></v-text-field>
                                    <!--<v-select-->
                                    <!--v-model="editItem.approver"-->
                                    <!--:items="approvers"-->
                                    <!--item-text="displayName"-->
                                    <!--name="approver"-->
                                    <!--label="Người xét duyệt"-->
                                    <!--return-object-->
                                    <!--&gt;</v-select>-->
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
                                                       :min="minDate"
                                                       :max="maxDate"
                                                       :allowed-dates="allowedDates"
                                                       :events="workingTaskDates"
                                                       event-color="red"
                                                       @input="setToDate"></v-date-picker>
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
                                                       :min="editItem.fromDate"
                                                       :max="maxDate"
                                                       :allowed-dates="allowedDates"
                                                       :events="workingTaskDates"
                                                       event-color="red"
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
                <td class="text-xs-left">{{props.item.content | truncate(30) }}</td>
                <td class="text-xs-left">{{props.item.fromDate}}</td>
                <td class="text-xs-left">{{props.item.dayOff}}</td>
                <!--<td class="text-xs-left">{{props.item.toDate}}</td>-->
                <!--<td class="text-xs-left">{{props.item.createdDate}}</td>-->
                <td class="text-xs-left">{{props.item.approver.displayName}}</td>
                <td class="text-xs-left">
                    <v-card-actions>
                        <v-dialog v-model="detailDialog" max-width="500px" v-if="props.item.status !== 0">
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
                                    <v-btn color="blue darken-1" flat @click="closeDetail">ĐÓNG</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                        <v-btn outline fab small color="indigo" @click="editLeaveRequest(props.item)" v-if="props.item.status === 0">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn outline fab small color="red" @click="deleteLeaveRequest(props.item.id)" v-if="props.item.status === 0">
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
    import moment from "moment";
    import {pushNotif} from '@/firebase.js'

    var notAllowedDate = [];

    export default {
        name: "UserLeaveRequestTable",
        props: {
            type: String,
            refreshFlag: Boolean,
            yearSummary: Object
        },
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                title: '',
                status: 0,
                dialog: false,
                detailDialog: false,
                rules: {
                    required: v => !!v || 'Nội dung không được để trống',
                    max: v => (!!v && v.length <= 255) || 'Nội dung tối đa 255 kí tự'
                },
                minDate: moment(new Date()).toISOString().substr(0, 10),
                maxDate: moment(new Date().get).add(365, 'days').toISOString().substr(0, 10),
                defaultItem: {
                    id: 0,
                    content: '',
                    fromDate: moment(new Date()).toISOString().substr(0, 10),
                    toDate: moment(new Date()).toISOString().substr(0, 10),
                    user: {},
                    approver: {},
                    status: 0
                },
                editItem: {
                    id: 0,
                    content: '',
                    fromDate: moment(new Date()).toISOString().substr(0, 10),
                    toDate: moment(new Date()).toISOString().substr(0, 10),
                    user: {},
                    approver: {},
                    status: 0
                },
                fromDateMenu: false,
                toDateMenu: false,
                createdDateMenu: false,
                userLeaveRequests: [],
                approvers: [],
                workingTaskDates: [],
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
                        {text: 'Số ngày nghỉ', value: 'dayOff'},
                        // {text: 'Ngày kết thúc', value: 'toDate'},
                        // {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Người xét duyệt', value: 'approver.displayName'},
                        {text: 'Thao tác', sortable: false},
                    ]
                },
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                role: state => state.role,
                displayName: state => state.displayName,
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
                        break;
                    case 'approved':
                        this.title = 'ĐƠN ĐÃ DUYỆT';
                        this.status = 1;
                        break;
                    case 'declined':
                        this.title = 'ĐƠN BỊ TỪ CHỐI';
                        this.status = 2;
                        break;
                }
                this.refresh();
                this.getApprovers();
            })
        },
        methods: {
            getApprovers: function () {
                var roleName = "ROLE_MANAGER";
                if (!this.isStaff) {
                    roleName = "ROLE_ADMIN";
                }
                axios.get(`http://localhost:8080/users/findAllDisplayNameByDepartmentAndRoleNameOfCurrentLoggedManager`,
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
            getCalendarData: function () {
                //get not allow date
                axios.get(`http://localhost:8080/leaveRequests/search/notAllowDateFromToday`,
                ).then(response => {
                        notAllowedDate = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
                //get dates have working task
                axios.get(`http://localhost:8080/leaveRequests/search/workingTaskDateFromToday`,
                ).then(response => {
                        this.workingTaskDates = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            setDialog: function () {
                if(this.yearSummary.dayOffRemain <= 0){
                   this.snackBarText = "Ngày nghỉ phép trong năm đã hết";
                   this.snackbar = true;
                   return;
                }

                //Set available dates
                var count = 0;
                var minAvailableDate = moment(new Date()).add(count, 'days').toISOString().substr(0, 10);
                while (notAllowedDate.includes(minAvailableDate)) {
                    count++;
                    minAvailableDate = moment(new Date()).add(count, 'days').toISOString().substr(0, 10);
                }
                this.editItem.fromDate = minAvailableDate;
                this.editItem.toDate = minAvailableDate;

                //Set approver
                this.editItem.approver = this.approvers[0];

                //Reset content
                this.$refs.txtContent.reset();

                this.dialog = true;
            },
            setToDate: function () {
                this.fromDateMenu = false;
                if (this.editItem.toDate < this.editItem.fromDate) {
                    this.editItem.toDate = this.editItem.fromDate;
                }
            },
            getUserLeveRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/leaveRequests/search/findByUser`,
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
                this.getCalendarData();
            },
            deleteLeaveRequest(id) {
                if (confirm('Bạn muốn xóa đơn này?')) {
                    axios.delete(`http://localhost:8080/leaveRequests/` + id)
                        .then(() => {
                                //create and send notification
                                var title = "Một đơn nghỉ phép đã xóa bởi " + this.displayName;
                                var detail = '';
                                var url = "/approverLeaveRequests";
                                var users = [];
                                users.push(this.approvers[0]);
                                pushNotif(title, detail, url, users);
                                //refresh and dialog
                                this.refresh();
                                this.snackbar = true;
                                this.snackBarText = "Thành công";
                                this.$emit("refresh");
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
                Object.assign(this.editItem, item);
                this.dialog = true;
            },
            closeDetail() {
                this.detailDialog = false
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editItem = Object.assign({}, this.defaultItem)
                }, 300)
            },
            save() {
                //check input condition
                if (this.editItem.content == null || this.editItem.content.trim() == '') {
                    this.snackBarText = 'Nội dung không được để trống';
                    this.snackbar = true;
                    return;
                }
                if (this.editItem.content.length > 255) {
                    this.snackBarText = 'Nội dung không được quá 255 kí tự';
                    this.snackbar = true;
                    return;
                }
                if (this.editItem.fromDate > this.editItem.toDate) {
                    this.snackBarText = 'Ngày nghỉ phép không hợp lệ';
                    this.snackbar = true;
                    return;
                }

                //check input date
                var fromDate = moment(this.editItem.fromDate).add(1, 'days');
                var toDate = moment(this.editItem.toDate).add(1, 'days');
                //check remain day off
                if(toDate.diff(fromDate) > this.yearSummary.dayOffRemain){
                    this.snackBarText = "Ngày nghỉ phép còn lại không đủ";
                    this.snackbar = true;
                    return;
                }
                //check not alow day
                while (fromDate.add(1, 'days').diff(toDate) <= 0) {
                    if (notAllowedDate.includes(fromDate.clone().toISOString().substr(0, 10))) {
                        this.snackBarText = 'Ngày nghỉ phép không hợp lệ';
                        this.snackbar = true;
                        return;
                    }
                }

                //call api
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
                ).then(() => {
                        //create and send notification
                        var title = "Đơn xin nghỉ phép mới từ " + this.displayName;
                        //reset title for edit request
                        if (this.editItem.id != 0) {
                            title = "Đơn nghỉ phép chỉnh sửa từ" + this.displayName;
                        }
                        var detail = this.editItem.content;
                        var url = "/approverLeaveRequests";
                        var users = [];
                        users.push(this.editItem.approver);
                        pushNotif(title, detail, url, users);
                        //refresh and dialog
                        this.close();
                        this.refresh();
                        this.snackBarText = 'Thành công';
                        this.snackbar = true;
                        this.$emit("refresh");
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                        if (error.response.status == 405) {
                            this.snackBarText = 'Không thể tạo đơn vì chưa bàn giao công việc';
                            this.snackbar = true;
                            if (this.editItem.id != 0) {
                                this.snackBarText = 'Không thể chỉnh sửa đơn đã duyệt';
                                this.snackbar = true;
                            }
                        } else {
                            this.snackBarText = 'Thất bại';
                            this.snackbar = true;
                        }
                    }
                );
            },
            allowedDates: val => notAllowedDate.indexOf(val) == -1
        },
        watch: {
            pagination: function () {
                this.getUserLeveRequests();
            },
            refreshFlag: function () {
                this.getUserLeveRequests();
            }
        }
    }
</script>

<style scoped>

</style>