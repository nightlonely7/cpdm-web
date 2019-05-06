<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">CHÍNH SÁCH NGHỈ PHÉP</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on" @click="setDialog">Thêm mới</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                        <span class="headline">CHÍNH SÁCH NGHỈ PHÉP</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            ref="txtNoOfDate"
                                            type="number"
                                            v-model="editItem.number_of_day_off_free_check"
                                            label="Số ngày nghỉ"
                                            hint="Số ngày nghỉ tối đa không cần bàn giao công việc"
                                            :rules="[rules.required]"
                                            min="0"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
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
                                                    v-model="editItem.valid_from_date"
                                                    label="Ngày bắt đầu"
                                                    prepend-icon="event"
                                                    readonly
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker v-model="editItem.valid_from_date"
                                                       :min="minDate"
                                                       :allowed-dates="allowedDates"
                                                       @input="fromDateMenu = false"></v-date-picker>
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
                :items="policyForLeaveList"
                :loading="table.loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                rows-per-page-text="Số hàng mỗi trang"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                must-sort>
            <v-progress-linear #progress color="blue" indeterminate></v-progress-linear>
            <template #items="props">
                <td class="text-xs-left">{{props.item.number_of_day_off_free_check}}</td>
                <td class="text-xs-left">{{props.item.valid_from_date}}</td>
                <td class="text-xs-left">{{props.item.created_date}}</td>
                <td class="text-xs-left" v-if="isAdmin">
                    <v-card-actions>
                        <v-btn outline fab small color="indigo" @click="editPolicy(props.item)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn outline fab small color="red" @click="deletePolicy(props.item)">
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
    import moment from "moment";
    import {mapGetters, mapState} from 'vuex';
    import {pushNotif} from "@/firebase.js";

    var notAllowedDate = [];

    export default {
        name: "PolicyForLeavePage",
        data() {
            return {
                isAddNew: true,
                snackbar: false,
                snackBarText: '',
                dialog: false,
                minDate: moment(new Date()).add(1, 'days').toISOString().substr(0, 10),
                defaultItem: {
                    number_of_day_off_free_check: '',
                    valid_from_date: moment(new Date()).add(1, 'days').toISOString().substr(0, 10),
                },
                editItem: {
                    number_of_day_off_free_check: '',
                    valid_from_date: moment(new Date()).add(1, 'days').toISOString().substr(0, 10),
                },
                oldItem: {
                    number_of_day_off_free_check: '',
                    valid_from_date: moment(new Date()).add(1, 'days').toISOString().substr(0, 10),
                },
                fromDateMenu: false,
                pagination: {
                    sortBy: 'valid_from_date',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Số ngày nghỉ', value: 'number_of_day_off_free_check'},
                        {text: 'Ngày bắt đầu hiệu lực', value: 'valid_from_date'},
                        {text: 'Ngày tạo', value: 'created_date'},
                    ]
                },
                alert: '',
                policyForLeaveList: [],
                rules: {
                    required: v => !!v || 'Số ngày nghỉ không được bỏ trống',
                }
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
                if (this.isAdmin) {
                    this.table.headers.push({text: 'Thao tác', sortable: false});
                }
                this.refresh();
            })
        },
        methods: {
            getPolicyForLeaveList() {
                this.table.loading = true;
                axios.get(`http://localhost:8080/leaveRequests/search/policyForLeave`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.policyForLeaveList = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.policyForLeaveList = response.data.content;
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
            getNotAllowDate() {
                axios.get(`http://localhost:8080/leaveRequests/search/policyForLeave/notAllowDate`
                ).then(response => {
                        notAllowedDate = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            refresh() {
                this.getPolicyForLeaveList();
                this.getNotAllowDate();
            },
            editPolicy(item) {
                this.dialog = true;
                Object.assign(this.editItem, item);
                Object.assign(this.oldItem, item);
                this.isAddNew = false;
            },
            deletePolicy(item) {
                if (confirm('Bạn muốn xóa chính sách này?')) {
                    var url = `http://localhost:8080/leaveRequests/policyForLeave`;
                    var method = 'DELETE';
                    axios.request(
                        {
                            url: url,
                            method: method,
                            data: item
                        }
                    ).then(() => {
                            this.close();
                            this.refresh();
                            this.snackBarText = 'Thành công';
                            this.snackbar = true;
                        }
                    ).catch(error => {
                            console.log(error);
                            if (error.response) {
                                console.log(error.response.data)
                            }
                            if (error.response.status == 405) {
                                this.snackBarText = 'Không thể xóa chính sách đã hiệu lực';
                                this.snackbar = true;
                            } else {
                                this.snackBarText = 'Thất bại';
                                this.snackbar = true;
                            }
                        }
                    );
                }
            },
            setDialog() {
                this.isAddNew = true;
                //reset text input
                this.$refs.txtNoOfDate.reset();

                //Set available dates
                var count = 1;
                var minAvailableDate = moment(new Date()).add(count, 'days').toISOString().substr(0, 10);
                while (notAllowedDate.includes(minAvailableDate)) {
                    count++;
                    minAvailableDate = moment(new Date()).add(count, 'days').toISOString().substr(0, 10);
                }
                this.editItem.valid_from_date = minAvailableDate;
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editItem = Object.assign({}, this.defaultItem)
                }, 300)
            },
            save() {
                //validate input
                if (this.editItem.number_of_day_off_free_check == null) {
                    this.snackBarText = 'Số ngày nghỉ không được để trống';
                    this.snackbar = true;
                    return;
                }
                //call api
                var url = `http://localhost:8080/leaveRequests/policyForLeave`;
                var method = 'POST';
                var data = this.editItem;

                if (this.isAddNew == false) {
                    url = `http://localhost:8080/leaveRequests/policyForLeave`;
                    method = 'PUT';
                    data = {
                        "oldPolicyForLeave": this.oldItem,
                        "newPolicyForLeave": this.editItem
                    }
                }

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: data
                    }
                ).then(() => {
                        axios.get('http://localhost:8080/users/search/all/staff-and-manager'
                        ).then((response) => {
                            var title = 'Chính sách nghỉ phép đã được thay đổi';
                            var detail = '';
                            var url = '/policyForLeave';
                            var users = [];
                            users = response.data;
                            for(var i in users){
                                pushNotif(title, detail, url, users[i]);
                            }

                        }).catch((error) => {
                            console.log(error);
                        });
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
                            this.snackBarText = 'Ngày bắt đầu hiệu lực không hợp lệ';
                            this.snackbar = true;
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
                this.getPolicyForLeaveList();
            }
        }
    }
</script>

<style scoped>

</style>