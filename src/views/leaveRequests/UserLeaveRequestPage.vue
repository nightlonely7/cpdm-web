<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-5">
        <v-toolbar class="elevation-0">
            <v-toolbar-title>THÔNG TIN NGHỈ PHÉP TÓM TẮT</v-toolbar-title>
            <template slot="extension">
                <v-subheader>Số ngày nghỉ tối đa một năm</v-subheader>
                <v-text-field v-text="userYearLeaveSummary.dayOffPerYear"></v-text-field>
                <v-subheader>Số ngày nghỉ đã sử dụng trong năm</v-subheader>
                <v-text-field v-text="userYearLeaveSummary.dayOffApproved"></v-text-field>
                <v-subheader>Số ngày nghỉ còn lại trong năm</v-subheader>
                <v-text-field v-text="userYearLeaveSummary.dayOffRemain"></v-text-field>
            </template>
        </v-toolbar>
        <v-toolbar tabs fixed-tabs class="elevation-0">
            <v-toolbar-title>QUẢN LÝ ĐƠN XIN NGHỈ</v-toolbar-title>
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
                <UserLeaveRequestTable type="waiting" :refreshFlag="refreshWaiting" :yearSummary="userYearLeaveSummary" @refresh="getUserYearLeaveSummary"></UserLeaveRequestTable>
            </v-tab-item>
            <v-tab-item>
                <UserLeaveRequestTable type="approved" :refreshFlag="refreshApproved" :yearSummary="userYearLeaveSummary" @refresh="getUserYearLeaveSummary"></UserLeaveRequestTable>
            </v-tab-item>
            <v-tab-item>
                <UserLeaveRequestTable type="declined" :refreshFlag="refreshDeclined" :yearSummary="userYearLeaveSummary" @refresh="getUserYearLeaveSummary"></UserLeaveRequestTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>

    import {mapGetters, mapState} from "vuex";
    import axios from "axios";
    import UserLeaveRequestTable from "@/components/leaveRequests/UserLeaveRequestTable";

    export default {
        name: "UserLeaveRequestPage",
        components: {UserLeaveRequestTable},
        data() {
            return {
                tags: null,
                userLeaveRequests: [],
                userYearLeaveSummary: {
                    dayOffPerYear: 12,
                    dayOffApproved: 0,
                    dayOffRemain: 12,
                },
                year: new Date().toISOString().substr(0,4),
                pagination: {
                    sortBy: 'createdDate',
                    descending: true
                },
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
        },
        mounted() {
            this.$nextTick(function() {
                this.getUserYearLeaveSummary();
            });
        },
        methods: {
            getUserYearLeaveSummary: function() {
                axios.get(`http://localhost:8080/leaveRequests/search/findYearSummary/self`,
                    {
                        params: {
                            year: this.year
                        }
                    }
                ).then(response => {
                        console.log(response.data);
                        this.userYearLeaveSummary.dayOffPerYear = response.data.dayOffPerYear;
                        this.userYearLeaveSummary.dayOffApproved = response.data.dayOffApproved;
                        this.userYearLeaveSummary.dayOffRemain = response.data.dayOffRemain;
                    }
                ).catch(error => {
                        console.log(error)
                    }
                );
            },
        }
    }
</script>

<style scoped>

</style>