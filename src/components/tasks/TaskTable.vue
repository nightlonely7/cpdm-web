<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">
                <v-icon left>cached</v-icon>
                <span>Làm mới</span>
            </v-btn>
            <v-spacer></v-spacer>
            <TaskForm v-if="getTasksURL === 'search/creates'" @refresh="refresh" relative creating>
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
                :rows-per-page-text="'Số hàng mỗi trang'"
                :rows-per-page-items="[5, 10, 25, 50, {text: 'Tất cả', value: -1}]"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                :must-sort="true"
        >
            <template #pageText="{pageStart, pageStop, itemsLength}">
                {{pageStart}} - {{pageStop}} của tổng cộng {{itemsLength}}
            </template>
            <template #items="{item}">
                <router-link tag="tr" :to="`/tasks/${item.id}`"
                             onmouseover="this.style.cursor='pointer'"
                             onmouseout="this.style.cursor='none'"
                >
                    <td class="text-xs-left">{{item.title}}</td>
                    <td class="text-xs-left">{{item.summary}}</td>
                    <td class="text-xs-left">{{item.project.name}}</td>
                    <td class="text-xs-left">{{item.createdTime}}</td>
                    <td class="text-xs-left">{{item.startTime}}</td>
                    <td class="text-xs-left">{{item.endTime}}</td>
                    <td class="text-xs-left">{{item.completedTime || 'Chưa hoàn tất'}}</td>
                    <td class="text-xs-left">{{item.creator.displayName}}</td>
                    <td class="text-xs-left">{{item.executor.displayName}}</td>
                    <td class="text-xs-left">{{item.priority}}</td>
                    <td class="text-xs-left">
                        <v-chip v-if="item.status === 'Waiting'">Đang chờ</v-chip>
                        <v-chip v-if="item.status === 'Working'" color="primary" text-color="white">Đang thực hiện</v-chip>
                        <v-chip v-if="item.status === 'Completed'" color="success" text-color="white">Hoàn tất</v-chip>
                        <v-chip v-if="item.status === 'Complete outdated'" color="error" text-color="white">Hoàn tất quá hạn
                        </v-chip>
                        <v-chip v-if="item.status === 'Outdated'" color="error" text-color="white">Quá hạn</v-chip>
                        <v-chip v-if="item.status === 'Near deadline'" color="warning" text-color="white">Gần tới hạn</v-chip>
                    </td>
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
    import moment from 'moment';

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
                        {text: 'Thời gian hoàn tất', value: 'completedTime'},
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
                createdTimeFromSearchValue: state => state.createdTimeFromSearchValue,
                createdTimeToSearchValue: state => state.createdTimeToSearchValue,
                startTimeFromSearchValue: state => state.startTimeFromSearchValue,
                startTimeToSearchValue: state => state.startTimeToSearchValue,
                endTimeFromSearchValue: state => state.endTimeFromSearchValue,
                endTimeToSearchValue: state => state.endTimeToSearchValue,
                projectIdSearchValue: state => state.projectIdSearchValue,
            }),
            ...mapState('AUTHENTICATION', {
                isLoggedIn: state => state.isLoggedIn,
                isStaff: state => state.isStaff,
                isAdmin: state => state.isAdmin,
            }),
        },
        mounted() {
        },
        methods: {
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.getTasks();
            },
            getTasks: function () {
                this.table.loading = true;
                console.log('load');
                const url = `http://localhost:8080/tasks/${this.getTasksURL}`;
                const method = 'GET';
                const params = {
                    page: this.pagination.page - 1,
                    size: this.pagination.rowsPerPage,
                    sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                    title: this.titleSearchValue,
                    summary: this.summarySearchValue,
                    createdTimeFrom: this.createdTimeFromSearchValue,
                    createdTimeTo: this.createdTimeToSearchValue,
                    startTimeFrom: this.startTimeFromSearchValue,
                    startTimeTo: this.startTimeToSearchValue,
                    endTimeFrom: this.endTimeFromSearchValue,
                    endTimeTo: this.endTimeToSearchValue,
                    projectId: this.projectIdSearchValue,
                };
                axios({url, method, params})
                    .then(response => {
                        this.tasks = response.data.content;
                        this.pagination.totalItems = response.data.totalElements;
                    })
                    .catch(error => {
                        this.alert = 'Không thể truy cập';
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    })
                    .finally(() => {
                        this.table.loading = false;
                    })
            },
        },
        watch: {
            pagination: function () {
                this.getTasks();
            },
            titleSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            summarySearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            createdTimeFromSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            createdTimeToSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            startTimeFromSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            startTimeToSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            endTimeFromSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            endTimeToSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
            projectIdSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            }
        },
        created() {
            this.debouncedGetTasks = _.debounce(this.getTasks, 500);
        }
    }
</script>

<style scoped>

</style>