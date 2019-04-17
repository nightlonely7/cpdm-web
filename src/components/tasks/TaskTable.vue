<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">
                <v-icon left>cached</v-icon>
                <span>Tải lại</span>
            </v-btn>
            <v-spacer></v-spacer>
            <TaskForm v-if="getTasksURL === 'search/creates'" @refresh="refresh" relative creating>
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Tạo mới tác vụ</v-btn>
                </template>
            </TaskForm>
        </v-toolbar>
        <v-data-table
                :headers="filteredHeaders"
                :items="filteredTasks"
                :loading="table.loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                :rows-per-page-text="'Số hàng mỗi trang'"
                :rows-per-page-items="[5, 10, 25, 50, {text: 'Tất cả', value: -1}]"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                :must-sort="true"
                :headers-length="5"
                :expand="expand"
                item-key="id"
        >
            <template #pageText="{pageStart, pageStop, itemsLength}">
                {{pageStart}} - {{pageStop}} của tổng cộng {{itemsLength}}
            </template>
            <template #expand="props">
                <v-card flat>
                    <v-card-text>Peek-a-boo!</v-card-text>
                </v-card>
            </template>
            <template #items="{item}">
                <router-link tag="tr" :to="`/tasks/${item.id}`"
                             onmouseover="this.style.cursor='pointer'"
                             onmouseout="this.style.cursor='none'"
                >
                    <td class="text-xs-left" v-if="showColumn('title')">{{item.title}}</td>
                    <td class="text-xs-left" v-if="showColumn('summary')">{{item.summary}}</td>
                    <td class="text-xs-left" v-if="showColumn('project.name')">{{item.project.name}}</td>
                    <td class="text-xs-left" v-if="showColumn('createdTime')">{{
                        moment(item.createdTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')}}
                    </td>
                    <td class="text-xs-left" v-if="showColumn('startTime')">{{
                        moment(item.startTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')}}
                    </td>
                    <td class="text-xs-left" v-if="showColumn('endTime')">{{
                        moment(item.endTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')}}
                    </td>
                    <td class="text-xs-left" v-if="showColumn('completedTime')">
                        {{item.completedTime ?
                        moment(item.completedTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') :
                        'Chưa hoàn tất'}}
                    </td>
                    <td class="text-xs-left" v-if="showColumn('creator.displayName')">{{item.creator.displayName}}</td>
                    <td class="text-xs-left" v-if="showColumn('executor.displayName')">{{item.executor.displayName}}
                    </td>
                    <td :class="`text-xs-left font-weight-bold ${priorityColor(item.priority)}`" v-if="showColumn('priority')">
                        {{item.priority}}</td>
                    <td class="text-xs-left" v-if="showColumn('status')">
                        <v-chip v-if="item.status === 'Waiting'">
                            Đang chờ
                        </v-chip>
                        <v-chip v-if="item.status === 'Working'" color="primary" text-color="white">
                            Đang thực hiện
                        </v-chip>
                        <v-chip v-if="item.status === 'Completed'" color="success" text-color="white">
                            Hoàn tất
                        </v-chip>
                        <v-chip v-if="item.status === 'Complete outdated'" color="error" text-color="white">
                            Hoàn tất quá hạn
                        </v-chip>
                        <v-chip v-if="item.status === 'Outdated'" color="error" text-color="white">
                            Quá hạn
                        </v-chip>
                        <v-chip v-if="item.status === 'Near deadline'" color="warning" text-color="white">
                            Gần tới hạn
                        </v-chip>
                    </td>
                </router-link>
            </template>

        </v-data-table>
        <v-divider></v-divider>
        <v-card class="elevation-0">
            <v-card-title>NHỮNG CỘT HIỂN THỊ</v-card-title>
            <v-card-text>
                <v-layout wrap>
                    <template v-for="header in table.headers">
                        <v-flex xs3 :key="header.value">
                            <v-checkbox :label="header.text"
                                        v-model="header.selected"
                                        :value="header.selected"
                            ></v-checkbox>
                        </v-flex>
                    </template>
                </v-layout>
            </v-card-text>
        </v-card>
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
                expand: false,
                tasks: [],
                alert: '',
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tiêu đề', value: 'title', selected: true},
                        {text: 'Tổng quát', value: 'summary', selected: false},
                        {text: 'Dự án', value: 'project.name', selected: true},
                        {text: 'Thời gian tạo', value: 'createdTime', selected: false},
                        {text: 'Thời gian bắt đầu', value: 'startTime', selected: false},
                        {text: 'Thời gian kết thúc', value: 'endTime', selected: false},
                        {text: 'Thời gian hoàn tất', value: 'completedTime', selected: false},
                        {text: 'Người tạo', value: 'creator.displayName', selected: false},
                        {text: 'Người thực hiện', value: 'executor.displayName', selected: false},
                        {text: 'Độ ưu tiên', value: 'priority', selected: true},
                        {text: 'Trạng thái', value: 'status', selected: true},
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
                statusSearchValue: state => state.statusSearchValue,
                descriptionSearchValue: state => state.descriptionSearchValue,
            }),
            ...mapState('AUTHENTICATION', {
                isLoggedIn: state => state.isLoggedIn,
                isStaff: state => state.isStaff,
                isAdmin: state => state.isAdmin,
            }),
            filteredHeaders() {
                return this.table.headers.filter(h => h.selected);
            },
            filteredTasks() {
                return this.tasks.map(item => {
                    const filtered = Object.assign({}, item);
                    this.table.headers.forEach(header => {
                        if (!header.selected) delete filtered[header.value]
                    });
                    return filtered;
                })
            },
        },
        mounted() {
            this.$store.commit('TASK_STORE/SET_TASK_FORM', {id: 0, executor: {}});
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
                this.getTasks();
            },
            getTasks: function () {
                this.table.loading = true;
                console.log('load');
                console.log(this.statusSearchValue);
                const url = `http://localhost:8080/tasks/${this.getTasksURL}`;
                const method = 'GET';
                const params = {
                    page: this.pagination.page - 1,
                    size: this.pagination.rowsPerPage,
                    sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                    title: this.titleSearchValue,
                    summary: this.summarySearchValue,
                    description: this.descriptionSearchValue,
                    createdTimeFrom: this.createdTimeFromSearchValue,
                    createdTimeTo: this.createdTimeToSearchValue,
                    startTimeFrom: this.startTimeFromSearchValue,
                    startTimeTo: this.startTimeToSearchValue,
                    endTimeFrom: this.endTimeFromSearchValue,
                    endTimeTo: this.endTimeToSearchValue,
                    projectId: this.projectIdSearchValue,
                    status: _.isEmpty(this.statusSearchValue) ? null : this.statusSearchValue.join(','),
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
            showColumn(col) {
                return this.table.headers.find(h => h.value === col).selected
            },
            priorityColor(priority) {
                if (priority < 3)
                    return 'primary--text';
                if (priority < 4)
                    return 'yellow--text';
                if (priority < 5)
                    return 'warning--text';
                return 'red--text';
            }
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
            descriptionSearchValue: function () {
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
            },
            statusSearchValue: function () {
                this.pagination.page = 1;
                this.debouncedGetTasks();
            },
        },
        created() {
            this.debouncedGetTasks = _.debounce(this.getTasks, 500);
        }
    }
</script>

<style scoped>

</style>