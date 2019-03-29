<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-5">
        <v-toolbar  tabs fixed-tabs class="elevation-0">
            <v-toolbar-title>XÉT DUYỆT ĐƠN XIN NGHỈ PHÉP</v-toolbar-title>
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
                <ApproverLeaveRequestTable type="waiting" :refreshFlag="refreshWaiting"></ApproverLeaveRequestTable>
            </v-tab-item>
            <v-tab-item>
                <ApproverLeaveRequestTable type="approved" :refreshFlag="refreshApproved"></ApproverLeaveRequestTable>
            </v-tab-item>
            <v-tab-item>
                <ApproverLeaveRequestTable type="declined" :refreshFlag="refreshDeclined"></ApproverLeaveRequestTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>

    import {mapGetters, mapState} from "vuex";
    import ApproverLeaveRequestTable from '@/components/leaveRequests/ApproverLeaveRequestTable'

    export default {
        name: "ApproverLeaveRequestPage",
        components: {ApproverLeaveRequestTable},
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