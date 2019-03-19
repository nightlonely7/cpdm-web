<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="approverLeaveRequests"
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
                <td class="text-xs-left">{{props.item.content}}</td>
                <td class="text-xs-left">{{props.item.fromDate}}</td>
                <td class="text-xs-left">{{props.item.toDate}}</td>
                <td class="text-xs-left">{{props.item.createdDate}}</td>
                <td class="text-xs-left" v-if="props.item.status === 0">
                    <v-card-actions>
                        <v-btn outline fab small color="indigo"
                               @click="approveRequest(props.item)">
                            <v-icon>check</v-icon>
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

    export default {
        name: "ApproverLeaveRequestTable",
        props: {
            type: String,
        },
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                title: '',
                status: 0,
                approverLeaveRequests: [],
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
                        {text: 'Ngày tạo', value: 'createdDate'},
                    ]
                },
            }
        },
        mounted() {
            this.$nextTick()
            {
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
                this.getApproverLeveRequests();
            }
        },
        methods: {
            getApproverLeveRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/leaveRequests/findByApprover`,
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
                            this.approverLeaveRequests = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.approverLeaveRequests = response.data.content;
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
                this.getApproverLeveRequests();
            },
            approveRequest(request) {
                if (confirm('Bạn muốn duyệt đơn này?')) {
                    var url = `http://localhost:8080/leaveRequests/` + request.id;
                    var method = 'PUT';

                    var updateRequest = request;
                    updateRequest.status = 1;

                    axios.request(
                        {
                            url: url,
                            method: method,
                            data: updateRequest
                        }
                    ).then(() => {
                            this.getApproverLeveRequests();
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
        },
        watch: {
            pagination: function () {
                this.getApproverLeveRequests();
            }
        }
    }
</script>

<style scoped>

</style>