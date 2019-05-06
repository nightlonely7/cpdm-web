<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="approverAssignRequests"
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
                <td class="text-xs-left">{{props.item.user.displayName}}</td>
                <td class="text-xs-left">{{props.item.content | truncate(30)}}</td>
                <td class="text-xs-left">{{props.item.fromDate}}</td>
                <td class="text-xs-left">{{props.item.toDate}}</td>
                <!--<td class="text-xs-left">{{props.item.createdDate}}</td>-->
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
                <td class="text-xs-left">
                    <v-card-actions>
                        <v-btn outline fab small color="indigo"
                               @click="handleRequest(props.item,1)"
                               v-if="props.item.status === 0">
                            <v-icon>check</v-icon>
                        </v-btn>
                        <v-btn outline fab small color="red"
                               @click="handleRequest(props.item,2)"
                               v-if="props.item.status === 0">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on }">
                                <v-btn outline fab small color="indigo" v-on="on">
                                    <v-icon>info</v-icon>
                                </v-btn>
                            </template>
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
                                                        v-model="props.item.content"
                                                        label="Nội dung"
                                                        readonly
                                                ></v-textarea>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        v-model="props.item.approver.displayName"
                                                        label="Người xét duyệt"
                                                        readonly
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        v-model="props.item.assignee.displayName"
                                                        label="Người được ủy quyền"
                                                        readonly
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        v-model="props.item.fromDate"
                                                        label="Ngày bắt đầu"
                                                        prepend-icon="event"
                                                        readonly
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        v-model="props.item.toDate"
                                                        label="Ngày kết thúc"
                                                        prepend-icon="event"
                                                        readonly
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm12 md12>
                                                <v-autocomplete v-model="props.item.tasks"
                                                                :items="props.item.tasks"
                                                                item-text="title"
                                                                name="task"
                                                                label="Tác vụ"
                                                                return-object
                                                                multiple
                                                                chips
                                                                readonly>

                                                </v-autocomplete>
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
    import {mapState} from 'vuex';
    import {mes, pushNotif} from "@/firebase.js";

    export default {
        name: "ApproverAssignRequestTable",
        props: {
            type: String,
            refreshFlag: Boolean,
        },
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                dialog: false,
                title: '',
                status: 0,
                approverAssignRequests: [],
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'createdDate',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tên', value: 'user.displayName'},
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Ngày bắt đầu', value: 'fromDate'},
                        {text: 'Ngày kết thúc', value: 'toDate'},
                        // {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Tác vụ liên quan', value: 'tasks'},
                        {text: 'Thao tác', sortable: false},
                    ]
                },
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                displayName: state => state.displayName,
            })
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
                        this.title = 'ĐƠN ĐÃ TỪ CHỐI';
                        this.status = 2;
                        break;
                }
                this.getApproverAssignRequests();
            });
            mes.onMessage(() => {
                this.getApproverAssignRequests();
            });
        },
        methods: {
            getApproverAssignRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/assignRequests/search/findByApprover`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            status: this.status,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.approverAssignRequests = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.approverAssignRequests = response.data.content;
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
                this.getApproverAssignRequests();
            },
            handleRequest(request, status) {
                if (confirm('Bạn muốn duyệt đơn này?')) {
                    var url = `http://localhost:8080/assignRequests/` + request.id;
                    var method = 'PUT';

                    var updateRequest = request;
                    updateRequest.status = status;

                    axios.request(
                        {
                            url: url,
                            method: method,
                            data: updateRequest
                        }
                    ).then(() => {
                            this.pushnotification(updateRequest);
                            this.getApproverAssignRequests();
                            this.snackBarText = 'Thành công';
                            this.snackbar = true;
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
            }
            , pushnotification(item) {
                var title = "Đơn xin ủy quyền đã xử lý bởi " + this.displayName;
                var url = "/userAssignRequests";
                var detail = item.content;
                var users = [];
                users.push(item.user);
                pushNotif(title, detail, url, users);
            },
            close(){
                this.dialog = false;
            }
        },
        watch: {
            pagination: function () {
                this.getApproverAssignRequests();
            },
            refreshFlag: function () {
                this.getApproverAssignRequests();
            }
        }
    }
</script>

<style scoped>

</style>