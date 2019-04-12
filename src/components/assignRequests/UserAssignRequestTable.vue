<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" v-if="this.status===0" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">ĐƠN XIN ỦY QUYỀN</span>
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
                                            counter
                                            maxlength="255"
                                            readonly
                                    ></v-textarea>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="editItem.approver.displayName"
                                            label="Người xét duyệt"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field v-model="editItem.assignee.displayName"
                                                  label="Người được ủy quyền"
                                                  readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="editItem.fromDate"
                                            label="Ngày bắt đầu"
                                            prepend-icon="event"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="editItem.toDate"
                                            label="Ngày kết thúc"
                                            prepend-icon="event"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-select
                                            v-model="editItem.tasks"
                                            :items="tasks"
                                            item-text="title"
                                            name="task"
                                            label="Tác vụ"
                                            return-object
                                            multiple
                                            chips
                                            readonly
                                    ></v-select>
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
                :items="userAssignRequests"
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
                <td class="text-xs-left">
                    <template v-for="task in props.item.tasks">
                        <router-link :key="task.id"
                                     :to="`/tasks/${task.id}`"
                                     class="text-xs-left"
                                     onmouseover="this.style.cursor='pointer'"
                                     onmouseout="this.style.cursor='none'">
                            {{task.title}}
                        </router-link>
                        <br/>
                    </template>
                </td>
                <td class="text-xs-left" v-if="props.item.status === 0">
                    <v-card-actions>
                        <!--<v-btn outline fab small color="indigo" @click="editAssignRequest(props.item)">-->
                            <!--<v-icon>info</v-icon>-->
                        <!--</v-btn>-->
                        <v-btn outline fab small color="red" @click="deleteAssignRequest(props.item.id)">
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

    var notAllowedDate = [];

    export default {
        name: "UserAssignRequestTable",
        props: {
            type: String,
            refreshFlag: Boolean,
        },
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                title: '',
                status: 0,
                dialog: false,
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
                    assignee: {},
                    approver: {},
                    tasks: [],
                    status: 0
                },
                editItem: {
                    id: 0,
                    content: '',
                    fromDate: moment(new Date()).toISOString().substr(0, 10),
                    toDate: moment(new Date()).toISOString().substr(0, 10),
                    user: {},
                    assignee: {},
                    approver: {},
                    tasks: [],
                    status: 0
                },
                fromDateMenu: false,
                toDateMenu: false,
                createdDateMenu: false,
                userAssignRequests: [],
                approvers: [],
                assignees: [],
                tasks: [],
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
                        {text: 'Ngày kết thúc', value: 'toDate'},
                        {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Người xét duyệt', value: 'approver.displayName'},
                        {text: 'Tác vụ liên quan', value: 'tasks'},
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
                    case 'declined':
                        this.title = 'ĐƠN BỊ TỪ CHỐI';
                        this.status = 2;
                        break;
                }
                this.refresh();
                this.getApprovers();
                this.getAssignees();
                this.getTasks();
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
            getAssignees: function () {
                axios.get(`http://localhost:8080/users/findAllAssignee`
                ).then(response => {
                        this.assignees = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            getTasks: function(){
                axios.get(`http://localhost:8080/tasks/search/executes`
                ).then(response => {
                        if (response.status === 204) {
                            this.tasks = [];
                        } else {
                            this.tasks = response.data.content;
                        }
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
            },
            setToDate: function(){
                this.fromDateMenu = false;
                if(this.editItem.toDate < this.editItem.fromDate)   {
                    this.editItem.toDate = this.editItem.fromDate;
                }
            },
            getUserAssignRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/assignRequests/search/findByUser`,
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
                            this.userAssignRequests = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.userAssignRequests = response.data.content;
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
                this.getUserAssignRequests();
                this.getCalendarData();
            },
            deleteAssignRequest(id) {
                if (confirm('Bạn muốn xóa đơn này?')) {
                    axios.delete(`http://localhost:8080/assignRequests/` + id)
                        .then(() => {
                                this.refresh();
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
            editAssignRequest(item) {
                Object.assign(this.editItem,item);
                this.dialog = true;
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editItem = Object.assign({}, this.defaultItem)
                }, 300)
            },
            save() {
                //check input condition
                if (this.editItem.fromDate > this.editItem.toDate) {
                    this.snackBarText = 'Ngày ủy quyền phép không hợp lệ';
                    this.snackbar = true;
                    return;
                }
                var fromDate = moment(this.editItem.fromDate).add(1, 'days');
                var toDate = moment(this.editItem.toDate).add(1, 'days');
                while (fromDate.add(1, 'days').diff(toDate) <= 0) {
                    if (notAllowedDate.includes(fromDate.clone().toISOString().substr(0, 10))) {
                        this.snackBarText = 'Ngày ủy quyền phép không hợp lệ';
                        this.snackbar = true;
                        return;
                    }
                }
                if (this.editItem.content == null || this.editItem.content.trim() == '') {
                    this.snackBarText = 'Nội dung không được để trống';
                    this.snackbar = true;
                    return;
                }
                else if (this.editItem.content.length > 255) {
                    this.snackBarText = 'Nội dung không được quá 255 kí tự';
                    this.snackbar = true;
                    return;
                }
                else if (this.editItem.assignee == null) {
                    this.snackBarText = 'Người được ủy quyền chưa được chọn';
                    this.snackbar = true;
                    return;
                }
                else if (this.editItem.tasks == null) {
                    this.snackBarText = 'Tác vụ ủy quyền chưa được chọn';
                    this.snackbar = true;
                    return;
                }

                //call api
                var url = `http://localhost:8080/assignRequests`;
                var method = 'POST';

                if (this.editItem.id != 0) {
                    url = `http://localhost:8080/assignRequests/` + this.editItem.id;
                    method = 'PUT';
                }

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.editItem
                    }
                ).then(() => {
                        this.close();
                        this.refresh();
                        this.snackBarText = 'Thành công';
                        this.snackbar = true;
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
                this.getUserAssignRequests();
            },
            refreshFlag: function () {
                this.getUserAssignRequests();
            }
        }
    }
</script>

<style scoped>

</style>