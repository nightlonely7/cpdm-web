<template>
    <div>
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">DANH SÁCH PHÒNG BAN</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="showForm">Tạo mới phòng ban</v-btn>
            <DepartmentForm></DepartmentForm>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="departments"
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
                <router-link tag="tr" :to="`/departments/${props.item.id}`"
                             onmouseover="this.style.cursor='pointer'"
                             onmouseout="this.style.cursor='none'"
                >
                    <td class="text-xs-left">{{props.item.name}}</td>
                    <td class="text-xs-left">{{props.item.alias}}</td>
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import DepartmentForm from "./DepartmentForm";
    import 'vuex';
    import _ from 'lodash';

    export default {
        name: "DepartmentTable",
        components: {DepartmentForm},
        data() {
            return {
                alert: '',
                pagination: {
                    sortBy: 'name',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tên phòng ban', value: 'name'},
                        {text: 'Mã phòng ban', value: 'alias'}
                    ]
                },
            }
        },
        mounted() {
            this.getDepartments();
        },
        computed: {
            departments: {
                get() {
                    return this.$store.state.DEPARTMENT_STORE.departments;
                },
                set(value) {
                    this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENTS', value);
                }
            }
        },
        methods: {
            getDepartments: function () {
                axios.get('http://localhost:8080/departments',
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                        }
                    })
                    .then(
                        response => {
                            this.departments = response.data.content;
                            // this.pagination = response.data.pageable;
                            this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENTS', this.departments);
                            this.pagination.totalItems = response.data.totalElements;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            },
            refresh: function () {
                this.setPaging();
                this.getDepartments();
            },
            showForm: function () {
                this.$store.commit('DEPARTMENT_STORE/SET_SHOW_FORM', true);
                this.$store.commit('DEPARTMENT_STORE/SET_IS_EDIT', false);
                this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_NAME', '');
                this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_FORM', {
                    id: 0,
                    name: '',
                    alias: '',
                    isAvailable: true
                });
            },
            setPaging: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'name';
                this.pagination.descending = true;
            }
        },
        watch: {
            pagination: function () {
                this.getDepartments();
            }
        },
        created() {
            this.debouncedGetTasks = _.debounce(this.getDepartments, 500);
        }
    }
</script>

<style scoped>

</style>