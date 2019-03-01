<template>
    <div>
        <v-text-field v-model="titleSearchValue"
                      label="Tìm bởi tiêu đề"
                      clearable
        ></v-text-field>
        <v-text-field v-model="summarySearchValue"
                      label="Tìm bởi nội dung tổng quát"
                      clearable
        ></v-text-field>
        <div class="elevation-5">
            <v-toolbar flat color="white">
                <v-toolbar-title>DACH SÁCH TÁC VỤ</v-toolbar-title>
                <v-divider class="mx-2" inset vertical></v-divider>
                <v-btn @click="refresh()">Làm mới</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="table.dialog = true">Tạo mới tác vụ</v-btn>
                <TaskForm :activate="table.dialog" @close="table.dialog = false" @refresh="refresh" ></TaskForm>
            </v-toolbar>
            <v-data-table
                    :headers="table.headers"
                    :items="tasks"
                    :loading="table.loading"
                    :pagination.sync="pagination"
                    :total-items="pagination.totalItems"
                    rows-per-page-text="Số hàng mỗi trang"
                    must-sort
            >
                <v-progress-linear #progress color="blue" indeterminate></v-progress-linear>

                <template #items="props">
                    <tr @click="goDetail(props.item.id)"
                        onmouseover="this.style.cursor='pointer'"
                        onmouseout="this.style.cursor='none'"
                    >
                        <td class="text-xs-left">{{props.item.title}}</td>
                        <td class="text-xs-left">{{props.item.summary}}</td>
                        <td class="text-xs-left">{{props.item.createdTime}}</td>
                        <td class="text-xs-left">{{props.item.startTime}}</td>
                        <td class="text-xs-left">{{props.item.endTime}}</td>
                        <td class="text-xs-left">{{props.item.creator.displayName}}</td>
                        <td class="text-xs-left">{{props.item.executor.displayName}}</td>
                        <td class="text-xs-left">{{props.item.priority}}</td>
                        <td class="text-xs-left">{{props.item.status}}</td>
                    </tr>

                </template>
            </v-data-table>
        </div>

    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import TaskForm from "@/components/TaskForm";

    export default {
        name: "TaskTable",
        components: {TaskForm},
        data() {
            return {
                canLoadData: true,
                titleSearchValue: '',
                summarySearchValue: '',
                isSearching: false,
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
                table: {
                    dialog: false,
                    loading: true,
                    headers: [
                        {text: 'Tiêu đề', value: 'title'},
                        {text: 'Tổng quát', value: 'summary'},
                        {text: 'Thời gian tạo', value: 'createdTime'},
                        {text: 'Thời gian bắt đầu', value: 'startTime'},
                        {text: 'Thời gian kết thúc', value: 'endTime'},
                        {text: 'Người tạo', value: 'creator.displayName'},
                        {text: 'Người thực hiện', value: 'executor.displayName'},
                        {text: 'Độ ưu tiên', value: 'priority'},
                        {text: 'Trạng thái', value: 'status'},
                    ]
                },
                tasks: [{
                    id: 0,
                    title: '',
                    summary: '',
                    createdTime: '',
                    startTime: '',
                    endTime: '',
                    creator: {id: 0, displayName: ''},
                    executor: {id: 0, displayName: ''},
                    priority: 0,
                    status: ''
                }],
                searchFieldOptions: [
                    {text: 'Title', value: 'title'},
                    {text: 'Summary', value: 'summary'}
                ],
            }
        },
        computed: {},
        mounted() {


        },
        methods: {
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.titleSearchValue = '';
                this.summarySearchValue = '';
                this.isSearching = false;
                this.canLoadData = false;
                this.getTasks();
                setTimeout(() => this.canLoadData = true, 500)
            },
            getTasks: function () {
                this.table.loading = true;
                if (this.isSearching) {
                    this.pagination.page = 1;
                }
                axios.get(`http://localhost:8080/tasks/findByCurrentLoggedCreator`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            title: this.titleSearchValue == null ? '' : this.titleSearchValue,
                            summary: this.summarySearchValue == null ? '' : this.summarySearchValue
                        },
                        headers: {
                            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGFuaG5wQGdtYWlsLmNvbSIsImV4cCI6MTU1MTYxMTA5N30.uKQtiMqFMbG0NFaGkRmReHdKdj3OP8rK7J8KfUeDEGEqTu0JHop-ZBBir1067I57pV7eOzes8sY3w7pW6xe6Kg'
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.tasks = []
                        } else {
                            const data = response.data;
                            this.tasks = data.content;
                            this.pagination.totalItems = data.totalElements;
                        }
                        this.table.loading = false;
                    }
                );
            },
            goDetail: function (id) {
                this.$router.push(`/tasks/${id}`);
            }

        },
        watch: {
            pagination: function () {
                this.isSearching = false;
                if (this.canLoadData) {
                    this.getTasks();
                }
            },
            titleSearchValue: function () {
                this.isSearching = true;
                if (this.canLoadData) {
                    this.debouncedGetTasks();
                }
            },
            summarySearchValue: function () {
                this.isSearching = true;
                if (this.canLoadData) {
                    this.debouncedGetTasks();
                }
            }
        },
        created() {
            this.debouncedGetTasks = _.debounce(this.getTasks, 500);
        }
    }
</script>

<style scoped>

</style>