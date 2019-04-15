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
            <v-btn color="primary" @click="showForm">Tạo mới dự án</v-btn>
            <ProjectForm></ProjectForm>
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
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import 'vuex';
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
                        {text: 'Mã dự án', value: 'alias'}
                    ]
                },
            }
        },
        mounted() {
            this.getProjects();
        },
        computed: {
            projects: {
                get() {
                    return this.$store.state.PROJECT_STORE.projects;
                },
                set(value) {
                    this.$store.commit('PROJECT_STORE/SET_PROJECTS', value);
                }
            }
        },
        methods: {
            getProjects: function () {
                axios.get('http://localhost:8080/projects',
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                        }
                    })
                    .then(
                        response => {
                            this.projects = response.data.content;
                            this.$store.commit('PROJECT_STORE/SET_PROJECTS', this.projects);
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
            showForm: function () {
                this.$store.commit('PROJECT_STORE/SET_SHOW_FORM', true);
                this.$store.commit('PROJECT_STORE/SET_IS_EDIT', false);
                this.$store.commit('PROJECT_STORE/SET_PROJECT_NAME', '');
                this.$store.commit('PROJECT_STORE/SET_PROJECT_FORM', {
                    id: 0,
                    name: '',
                    alias: ''
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
                this.getProjects();
            }
        },
        created() {
            this.debouncedGetTasks = _.debounce(this.getProjects, 500);
        }
    }
</script>

<style scoped>

</style>