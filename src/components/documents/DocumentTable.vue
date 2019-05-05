<template>
    <div class="elevation-1">
        <v-expansion-panel focusable class="elevation-1">
            <v-expansion-panel-content>
                <template slot="header">
                    <div>Tìm kiếm</div>
                </template>
                <DocumentSearch></DocumentSearch>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">Quản lý tài liệu</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()"><v-icon left>mdi-cached</v-icon>Tải lại</v-btn>
            <v-spacer></v-spacer>
            <DocumentForm @refresh="refresh" v-if="isAdmin" document-title="" :creating="true">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary"><v-icon left>add</v-icon>Tạo mới tài liệu</v-btn>
                </template>
            </DocumentForm>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="documents"
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
                <router-link tag="tr" :to="`/documents/${item.id}`"
                             onmouseover="this.style.cursor='pointer'"
                             onmouseout="this.style.cursor='none'"
                >
                    <td class="text-xs-left">{{item.title}}</td>
                    <td class="text-xs-left">{{item.summary}}</td>
                    <td class="text-xs-left">{{item.project.name}}</td>
                    <td class="text-xs-left">{{moment(item.createdTime).format('DD-MM-YYYY HH:mm:ss')}}</td>
                    <td class="text-xs-left">{{moment(item.startTime).format('DD-MM-YYYY HH:mm:ss')}}</td>
                    <td class="text-xs-left">{{moment(item.endTime).format('DD-MM-YYYY HH:mm:ss')}}</td>
                </router-link>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import {mapGetters, mapState} from 'vuex'
    import DocumentForm from "./DocumentForm";
    import DocumentSearch from "./DocumentSearch";

    export default {
        name: "DocumentTable",
        components: {DocumentSearch, DocumentForm},
        props: {
            type: String
        },
        data() {
            return {
                dialog: false,
                documents: [],
                alert: '',
                pagination: {
                    sortBy: 'createdTime',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tiêu đề', value: 'title'},
                        {text: 'Nội dung tổng quát', value: 'summary'},
                        {text: 'Dự án', value: 'project.name'},
                        {text: 'Thời gian tạo', value: 'createdTime'},
                        {text: 'Thời gian hiệu lực', value: 'startTime'},
                        {text: 'Thời gian hết hạn', value: 'endTime'},
                    ]
                },
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION', {
                isAdmin: "isAdmin",
            }),
            ...mapState('DOCUMENT_STORE', {
                titleSearchValue: state => state.titleSearchValue,
                summarySearchValue: state => state.summarySearchValue
            }),
        },
        mounted() {
        },
        methods: {
            showForm: function () {
                this.dialog = true;
            },
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.getDocuments();
            },
            getDocuments: function () {
                this.table.loading = true;
                // const url = this.isAdmin ? `http://localhost:8080/documents` : `http://localhost:8080/documents/search/relatives`;
                const url = "http://localhost:8080/documents/search/titleAndSummary";
                const method = 'GET';
                const params = {
                    page: this.pagination.page - 1,
                    size: this.pagination.rowsPerPage,
                    sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                    title: this.titleSearchValue,
                    summary: this.summarySearchValue
                };
                axios({url, method, params})
                    .then(response => {
                        this.documents = response.data.content;
                        this.pagination.totalItems = response.data.totalElements;
                    })
                    .catch(error => {
                        this.alert = 'Không thể truy cập';
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error);
                        }
                    })
                    .finally(() => {
                        this.table.loading = false;
                    });
            },
        },
        watch: {
            pagination: function () {
                this.getDocuments();
            },
            titleSearchValue: function () {
                this.debouncedGetDocuments();
            },
            summarySearchValue: function () {
                this.debouncedGetDocuments();
            },
        },
        created() {
            this.debouncedGetDocuments = _.debounce(this.getDocuments, 500);
        }
    }
</script>

<style scoped>

</style>