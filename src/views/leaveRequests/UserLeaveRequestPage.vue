<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-5">
        <v-toolbar  tabs fixed-tabs class="elevation-0">
            <v-toolbar-title>QUẢN LÝ ĐƠN XIN NGHỈ</v-toolbar-title>
            <template slot="extension">
                <v-tabs
                        v-model="tags"
                        centered
                        slider-color="primary"
                        color="transparent"
                >
                    <v-tab>
                        ĐƠN CHỜ DUYỆT
                    </v-tab>
                    <v-tab>
                        ĐƠN ĐÃ DUYỆT
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-tabs-items v-model="tags">
            <v-tab-item>
                <UserLeaveRequestTable type="waiting"></UserLeaveRequestTable>
            </v-tab-item>
            <v-tab-item>
                <UserLeaveRequestTable type="approved"></UserLeaveRequestTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>

    import {mapGetters, mapState} from "vuex";
    import UserLeaveRequestTable from "@/components/leaveRequests/UserLeaveRequestTable";

    export default {
        name: "UserLeaveRequestPage",
        components: {UserLeaveRequestTable},
        data() {
            return {
                tags: null,
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
        }
    }
</script>

<style scoped>

</style>