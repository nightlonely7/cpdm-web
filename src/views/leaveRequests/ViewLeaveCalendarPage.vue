<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">LỊCH NGHỈ PHÉP</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-menu
                    v-model="menu"
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
                            v-model="date"
                            label="Ngày trong tuần"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="date"
                               @input="menu = false"></v-date-picker>
            </v-menu>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="viewleaves"
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
                <td class="text-xs-left">{{props.item.displayName}}</td>
                <template v-for="(leaveList,index) in props.item.leaveList">
                    <td :key="props.item.displayName + index" class="text-xs-center">
                        <v-icon
                                color="red darken-2"
                                v-if="leaveList.approved">
                            close
                        </v-icon>
                        <v-icon
                                color="yellow darken-2"
                                v-else-if="leaveList.waiting">
                            warning
                        </v-icon>
                    </td>
                </template>
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
    import moment from "moment";
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: "ViewLeaveCalendarPage",
        data() {
            return {
                dates: [],
                snackbar: false,
                snackBarText: '',
                menu: false,
                date: new Date().toISOString().substr(0, 10),
                fromDate: moment().isoWeekday(1).toISOString().substr(0, 10),
                toDate: moment().isoWeekday(7).toISOString().substr(0, 10),
                viewleaves: [],
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'displayName',
                    descending: false
                },
                table: {
                    loading: false,
                    headers: []
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
            this.$nextTick()
            {
                this.getViewLeaves();
            }
        },
        methods: {
            enumerateDaysBetweenDates: function (fromDate, toDate) {
                this.dates = [];

                var currDate = moment(fromDate).startOf('day').add(-1, 'days');
                var lastDate = moment(toDate).startOf('day');

                while (currDate.add(1, 'days').diff(lastDate) <= 0) {
                    this.dates.push(currDate.clone().toDate());
                }

                this.dates.reverse();
            },
            getViewLeaves: function () {
                this.table.loading = true;
                this.fromDate = moment(this.date).isoWeekday(1).toISOString().substr(0, 10);
                this.toDate = moment(this.date).isoWeekday(7).toISOString().substr(0, 10);
                this.enumerateDaysBetweenDates(this.fromDate, this.toDate);
                this.table.headers = [];
                this.table.headers.push({text: 'Tên', value: 'displayName'});

                while (this.dates.length > 0) {
                    var date = moment(this.dates.pop()).format('DD/MM/YYYY');
                    this.table.headers.push({text: date, sortable: false});
                }

                var url = `http://localhost:8080/leaveRequests/search/view-leaves-for-admin`;
                if (this.isManager) {
                    url = 'http://localhost:8080/leaveRequests/search/view-leaves-for-manager';
                }
                axios.get(url,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            fromDate: this.fromDate,
                            toDate: this.toDate,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.viewleaves = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.viewleaves = response.data.content;
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
                this.getViewLeaves();
            }
        },
        watch: {
            pagination: function () {
                this.getViewLeaves();
            },
            date: function () {
                this.getViewLeaves();
            }
        }
    }

</script>

<style scoped>

</style>