<template>
    <div>
        <UserLeaveRequestTable v-if="isAdmin || isManager"></UserLeaveRequestTable>
        <v-divider></v-divider>
        <br>
        <ApproverLeaveRequestTable v-if="isStaff || isManager"></ApproverLeaveRequestTable>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "LeaveRequestPage",
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