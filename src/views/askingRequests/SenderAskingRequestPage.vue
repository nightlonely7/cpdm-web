<template>
    <div class="elevation-5">
        <v-toolbar tabs fixed-tabs class="elevation-0">
            <v-toolbar-title>QUẢN LÝ YÊU CẦU</v-toolbar-title>
            <template slot="extension">
                <v-tabs
                        v-model="tags"
                        centered
                        slider-color="primary"
                        color="transparent"
                >
                    <v-tab @click="refreshWaiting = !refreshWaiting">
                        YÊU CẦU ĐANG CHỜ PHẢN HỒI
                    </v-tab>
                    <v-tab @click="refreshReplied = !refreshReplied">
                        YÊU CẦU ĐÃ ĐƯỢC PHẢN HỒI
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-tabs-items v-model="tags">
            <v-tab-item>
                <SenderAskingRequestTable type="waiting" :refreshFlag="refreshWaiting"></SenderAskingRequestTable>
            </v-tab-item>
            <v-tab-item>
                <SenderAskingRequestTable type="replied" :refreshFlag="refreshReplied"></SenderAskingRequestTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    import SenderAskingRequestTable from "../../components/askingRequests/SenderAskingRequestTable";
    import {mapGetters, mapState} from "vuex";
    import axios from "axios";

    export default {
        name: "SenderAskingRequestPage",
        components: {SenderAskingRequestTable},
        data() {
            return {
                tags: null,
                userAssignRequests: [],
                pagination: {
                    sortBy: 'createdDate',
                    descending: true
                },
                refreshWaiting: false,
                refreshReplied: false,
            }
        },
        computed: {
            ...
                mapState('AUTHENTICATION', {
                    role: state => state.role,
                }),
            ...
                mapGetters('AUTHENTICATION', {
                    isInit: 'isInit',
                    isLoggedIn: 'isLoggedIn',
                    isAdmin: 'isAdmin',
                    isManager: 'isManager',
                    isStaff: 'isStaff',
                }),
        },
        methods: {
            getUserLeveRequests: function (status) {
                this.table.loading = true;
                axios.get(`http://localhost:8080/assignRequests/search/findByUser`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            status: status
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.userAssignRequests = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.userAssignRequests = response.data.content;
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
            }
        }
    }
</script>

<style scoped>

</style>