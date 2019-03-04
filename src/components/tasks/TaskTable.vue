<template>
    <div class="elevation-5">
        <v-toolbar flat color="white">
            <v-toolbar-title>DACH SÁCH TÁC VỤ</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="showForm">Tạo mới tác vụ</v-btn>
            <TaskForm @refresh="refresh"></TaskForm>
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
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import TaskForm from '@/components/tasks/TaskForm.vue';
    import {mapState} from 'vuex'

    export default {
        name: "TaskTable",
        components: {TaskForm},
        data() {
            return {
                canLoadData: true,
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
            }
        },
        computed: {
            ...mapState({
                tasks: state => state.tasks,
                titleSearchValue: state => state.titleSearchValue,
                summarySearchValue: state => state.summarySearchValue,
            }),

        },
        mounted() {
            this.$store.commit('SET_TASK_FORM', {id: 0, executor: {}})

        },
        methods: {
            showForm: function () {
                this.$store.commit('SET_SHOW_FORM', true);
            },
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.$store.commit('SET_TITLE_SEARCH_VALUE', '');
                this.$store.commit('SET_SUMMARY_SEARCH_VALUE', '');
                this.isSearching = false;
                this.canLoadData = false;
                this.getTasks();
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
                            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGFuaG5wQGdtYWlsLmNvbSIsImV4cCI6MTU1MjUzMTM1MH0.9xhabQG_oKgDuwmH-w8YSGyrDoUjPCGSVzeColLY4xG2zJl9EBUNeNQJrwlM0rIaydXH1RbIHYm2LPk7yfJDKw'
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.$store.commit('SET_TASKS', [])
                        } else {
                            const data = response.data;
                            this.$store.commit('SET_TASKS', response.data.content);
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
                this.getTasks();
            },
            titleSearchValue: function () {
                this.isSearching = true;
                if (this.canLoadData) {
                    this.debouncedGetTasks();
                } else {
                    this.canLoadData = true;
                }
            },
            summarySearchValue: function () {
                this.isSearching = true;
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