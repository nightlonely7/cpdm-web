<template>
    <div>
        <v-expansion-panel focusable class="elevation-1">
            <v-expansion-panel-content>
                <template slot="header">
                    <div>Tìm kiếm</div>
                </template>
                <ProjectSearch></ProjectSearch>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">DANH SÁCH DỰ ÁN</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <ProjectForm :creating="false" @refresh="getProjects">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Tạo mới dự án</v-btn>
                </template>
            </ProjectForm>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="projects"
                :loading="table.loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                rows-per-page-text="Số hàng mỗi trang"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                class="elevation-1"
                must-sort
        >
            <v-progress-linear #progress color="blue" indeterminate></v-progress-linear>
            <template #items="props">
                <router-link tag="tr" :to="`/projects/${props.item.id}`"
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
    import {mapState} from 'vuex';
    import ProjectForm from "./ProjectForm";
    import ProjectSearch from "./ProjectSearch";

    export default {
        name: "ProjectTable",
        components: {ProjectSearch, ProjectForm},
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
                        {text: 'Tên dự án', value: 'name'},
                        {text: 'Mã dự án', value: 'alias'},
                        {text: 'Mô tả', value: 'description'}
                    ]
                },
                projects: []
            }
        },
        mounted() {
            this.getProjects();
        },
        computed: {
            ...mapState('PROJECT_STORE', {
                nameSearchValue: state => state.nameSearchValue,
                aliasSearchValue: state => state.aliasSearchValue,
            })
        },
        methods: {
            getProjects: function () {
                axios.get('http://localhost:8080/projects/search/nameAndAlias',
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
                            this.projects = response.data.content;
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
                this.getProjects();
            },
            setPaging: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'name';
                this.pagination.descending = true;
            }
        },
        watch: {
            pagination: function () {
                this.getProjects();
            },
            nameSearchValue: function () {
                this.debouncedGetProjects();
            },
            aliasSearchValue: function () {
                this.debouncedGetProjects();
            }
        },
        created() {
            this.debouncedGetProjects = _.debounce(this.getProjects, 500);
        }
    }
</script>

<style scoped>

</style>