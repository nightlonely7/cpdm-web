<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-5">
        <v-toolbar  tabs fixed-tabs class="elevation-0">
            <v-toolbar-title>XÉT DUYỆT ĐƠN XIN ỦY QUYỀN</v-toolbar-title>
            <template slot="extension">
                <v-tabs
                        v-model="tags"
                        centered
                        slider-color="primary"
                        color="transparent"
                >
                    <v-tab @click="refreshWaiting=!refreshWaiting">
                        ĐƠN CHỜ DUYỆT
                    </v-tab>
                    <v-tab @click="refreshApproved=!refreshApproved">
                        ĐƠN ĐÃ DUYỆT
                    </v-tab>
                    <v-tab @click="refreshDeclined=!refreshDeclined">
                        ĐƠN ĐÃ TỪ CHỐI
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-tabs-items v-model="tags">
            <v-tab-item>
                <ApproverAssignRequestTable type="waiting" :refreshFlag="refreshWaiting"></ApproverAssignRequestTable>
            </v-tab-item>
            <v-tab-item>
                <ApproverAssignRequestTable type="approved" :refreshFlag="refreshApproved"></ApproverAssignRequestTable>
            </v-tab-item>
            <v-tab-item>
                <ApproverAssignRequestTable type="declined" :refreshFlag="refreshDeclined"></ApproverAssignRequestTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>

    import {mapGetters, mapState} from "vuex";
    import ApproverAssignRequestTable from "../../components/assignRequests/ApproverAssignRequestTable";

    export default {
        name: "ApproverAssignRequestPage",
        components: {ApproverAssignRequestTable},
        data() {
            return {
                tags: null,
                refreshWaiting: false,
                refreshApproved: false,
                refreshDeclined: false,
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