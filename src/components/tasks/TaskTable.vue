<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <TaskForm v-if="getTasksURL === 'search/creates'" @refresh="refresh" relative>
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Tạo mới tác vụ</v-btn>
                </template>
            </TaskForm>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="tasks"
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
                <router-link tag="tr" :to="`/tasks/${props.item.id}`"
                             onmouseover="this.style.cursor='pointer'"
                             onmouseout="this.style.cursor='none'"
                >
                    <td class="text-xs-left">{{props.item.title}}</td>
                    <td class="text-xs-left">{{props.item.summary}}</td>
                    <td class="text-xs-left">{{props.item.project.name}}</td>
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
    import TaskForm from '@/components/tasks/TaskForm.vue';
    import {mapState} from 'vuex'

    export default {
        name: "TaskTable",
        components: {TaskForm},
        props: {
            title: String,
            getTasksURL: String,
        },
        data() {
            return {
                tasks: [],
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
                        {text: 'Dự án', value: 'project.name'},
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
            this.$store.commit('TASK_STORE/SET_TASK_FORM', {id: 0, executor: {}});

        },
        methods: {
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', '');
                this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', '');
                this.canLoadData = false;
                this.getTasks();
            },
            getTasks: function () {
                this.table.loading = true;
                console.log('load');
                axios.get(`http://localhost:8080/tasks/${this.getTasksURL}`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            title: this.titleSearchValue == null ? '' : this.titleSearchValue,
                            summary: this.summarySearchValue == null ? '' : this.summarySearchValue,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.tasks = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.tasks = response.data.content;
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
        },
        watch: {
            pagination: function () {
                this.getTasks();
            },
            titleSearchValue: function () {
                this.pagination.page = 1;
                if (this.canLoadData) {
                    this.debouncedGetTasks();
                } else {
                    this.canLoadData = true;
                }
            },
            summarySearchValue: function () {
                this.pagination.page = 1;
                if (this.canLoadData) {
                    this.debouncedGetTasks();
                } else {
                    this.canLoadData = true;
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