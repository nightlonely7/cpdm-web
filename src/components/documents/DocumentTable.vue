<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">Quản lý tài liệu</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <DocumentForm @refresh="refresh">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Tạo mới tài liệu</v-btn>
                </template>
            </DocumentForm>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="documents"
                :loading="table.loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                rows-per-page-text="Số hàng mỗi trang"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                must-sort
        >
            <v-progress-linear #progress color="primary" indeterminate></v-progress-linear>
            <template #items="{item}">
                <td class="text-xs-left">{{item.title}}</td>
                <td class="text-xs-left">{{item.summary}}</td>
                <td class="text-xs-left">{{item.project.name}}</td>
                <td class="text-xs-left">{{item.createdTime}}</td>
                <td class="text-xs-left">{{item.status}}</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import {mapState} from 'vuex'
    import DocumentForm from "./DocumentForm";

    export default {
        name: "DocumentTable",
        components: {DocumentForm},
        props: {
            type: String
        },
        data() {
            return {
                dialog: false,
                documents: [],
                alert: '',
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tiêu đề', value: 'title'},
                        {text: 'Nội dung tổng quát', value: 'summary'},
                        {text: 'Dự án', value: 'project.name'},
                        {text: 'Thời gian tạo', value: 'createdTime'},
                        {text: 'Trạng thái', value: 'status'},
                    ]
                },
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                isStaff: state => state.isStaff,
                isAdmin: state => state.isAdmin,
            })
        },
        mounted() {

        },
        methods: {
            showForm: function () {
                this.dialog = true;
            },
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.getDocuments();
            },
            getDocuments: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/documents`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.documents = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.documents = response.data.content;
                            this.pagination.totalItems = response.data.totalElements;
                        }
                    }
                ).catch(error => {
                        this.alert = 'Không thể truy cập';
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error);
                        }
                    }
                ).finally(() => {
                    this.table.loading = false;
                });
            },
        },
        watch: {
            pagination: function () {
                this.getDocuments();
            }
        },
        created() {
            this.debouncedGetTasks = _.debounce(this.getDocuments, 500);
        }
    }
</script>

<style scoped>

</style>