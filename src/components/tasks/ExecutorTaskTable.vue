<template>
    <div class="elevation-5">
        <v-toolbar flat color="white">
            <v-toolbar-title>QUẢN LÝ TÁC VỤ ĐƯỢC GIAO</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="executorTasks"
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
                <router-link tag="tr" :to="`tasks/${props.item.id}`"
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
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import {mapState} from 'vuex'

    export default {
        name: "ExecutorTaskTable",
        data() {
            return {
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
                table: {
                    loading: false,
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
            }
        },
        computed: {
            ...mapState('TASK_STORE', {
                executorTasks: state => state.executorTasks,
                titleSearchValue: state => state.titleSearchValue,
                summarySearchValue: state => state.summarySearchValue,
            }),
            ...mapState('AUTHENTICATION', {
                isLoggedIn: state => state.isLoggedIn,
                isStaff: state => state.isStaff,
                isAdmin: state => state.isAdmin,
            })
        },
        mounted() {
            this.$store.commit('TASK_STORE/SET_TASK_FORM', {id: 0, executor: {}})

        },
        methods: {
            showForm: function () {
                this.$store.commit('TASK_STORE/SET_SHOW_FORM', true);
            },
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', '');
                this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', '');
                this.canLoadData = false;
                this.getExecutorTasks();
            },
            getExecutorTasks: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/tasks/findByCurrentLoggedExecutor`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            title: this.titleSearchValue == null ? '' : this.titleSearchValue,
                            summary: this.summarySearchValue == null ? '' : this.summarySearchValue
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.$store.commit('TASK_STORE/SET_EXECUTOR_TASKS', []);
                            this.pagination.totalItems = 0;
                        } else {
                            const data = response.data;
                            this.$store.commit('TASK_STORE/SET_EXECUTOR_TASKS', response.data.content);
                            this.pagination.totalItems = data.totalElements;
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
        },
        watch: {
            pagination: function () {
                this.getExecutorTasks();
            },
            titleSearchValue: function () {
                this.pagination.page = 1;
                if (this.canLoadData) {
                    this.debouncedGetExecutorTasks();
                } else {
                    this.canLoadData = true;
                }
            },
            summarySearchValue: function () {
                this.pagination.page = 1;
                if (this.canLoadData) {
                    this.debouncedGetExecutorTasks();
                } else {
                    this.canLoadData = true;
                }
            }
        },
        created() {
            this.debouncedGetExecutorTasks = _.debounce(this.getExecutorTasks, 500);
        }
    }
</script>

<style scoped>

</style>