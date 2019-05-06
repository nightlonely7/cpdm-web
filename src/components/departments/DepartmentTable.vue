<template>
    <div>
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">DANH SÁCH PHÒNG BAN</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <DepartmentForm creating @refresh="getDepartments">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Tạo mới phòng ban</v-btn>
                </template>
            </DepartmentForm>
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
                    <td class="text-xs-left">{{props.item.description}}</td>
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import DepartmentForm from "./DepartmentForm";
    import {mapState} from 'vuex';
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
                        {text: 'Mã phòng ban', value: 'alias'},
                        {text: 'Mô tả', value: 'description'}
                    ]
                },
                departments: []
            }
        },
        mounted() {
            this.getDepartments();
        },
        computed: {
            ...mapState('DEPARTMENT_STORE', {
                nameSearchValue: state => state.nameSearchValue,
                aliasSearchValue: state => state.aliasSearchValue,
            })
        },
        methods: {
            getDepartments: function () {
                axios.get('http://localhost:8080/departments/search/nameAndAlias',
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            name: this.nameSearchValue,
                            alias: this.aliasSearchValue
                        }
                    })
                    .then(
                        response => {
                            this.departments = response.data.content;
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
            setPaging: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'name';
                this.pagination.descending = true;
            }
        },
        watch: {
            pagination: function () {
                this.getDepartments();
            },
            nameSearchValue: function () {
                this.debouncedGetDepartments();
            },
            aliasSearchValue: function () {
                this.debouncedGetDepartments();
            }
        },
        created() {
            this.debouncedGetDepartments = _.debounce(this.getDepartments, 500);
        }
    }
</script>

<style scoped>

</style>