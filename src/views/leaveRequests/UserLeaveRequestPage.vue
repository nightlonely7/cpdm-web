<template>
    <div>
        <UserLeaveRequestTable v-if="!isStaff"></UserLeaveRequestTable>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import UserLeaveRequestTable from "../../components/leaveRequests/UserLeaveRequestTable";

    export default {
        name: "LeaveRequestPage",
        components: {UserLeaveRequestTable},
        computed: {
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            })
        }
    }
</script>

<style scoped>

</style>