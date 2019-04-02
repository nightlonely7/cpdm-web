<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-5">
        <v-toolbar  tabs fixed-tabs class="elevation-0">
            <v-toolbar-title>QUẢN LÝ ĐƠN XIN ỦY QUYỀN</v-toolbar-title>
            <template slot="extension">
                <v-tabs
                        v-model="tags"
                        centered
                        slider-color="primary"
                        color="transparent"
                >
                    <v-tab @click="refreshWaiting = !refreshWaiting">
                        ĐƠN CHỜ DUYỆT
                    </v-tab>
                    <v-tab @click="refreshApproved = !refreshApproved">
                        ĐƠN ĐÃ DUYỆT
                    </v-tab>
                    <v-tab @click="refreshDeclined = !refreshDeclined">
                        ĐƠN BỊ TỪ CHỐI
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-tabs-items v-model="tags">
            <v-tab-item>
                <UserAssignRequestTable type="waiting" :refreshFlag="refreshWaiting"></UserAssignRequestTable>
            </v-tab-item>
            <v-tab-item>
                <UserAssignRequestTable type="approved" :refreshFlag="refreshApproved"></UserAssignRequestTable>
            </v-tab-item>
            <v-tab-item>
                <UserAssignRequestTable type="declined" :refreshFlag="refreshDeclined"></UserAssignRequestTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>

    import {mapGetters, mapState} from "vuex";
    import axios from "axios";
    import UserAssignRequestTable from "../../components/assignRequests/UserAssignRequestTable";

    export default {
        name: "UserAssignRequestPage",
        components: {UserAssignRequestTable},
        data() {
            return {
                tags: null,
                userAssignRequests: [],
                pagination: {
                    sortBy: 'createdDate',
                    descending: true
                },
                refreshWaiting : false,
                refreshApproved : false,
                refreshDeclined : false,
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                role: state => state.role,
            }),
            ...mapGetters('AUTHENTICATION', {
                isInit: 'isInit',
                isLoggedIn: 'isLoggedIn',
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            }),
        },
        methos: {
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