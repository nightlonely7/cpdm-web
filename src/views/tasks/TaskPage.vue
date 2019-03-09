<template>
    <div>
        <TaskSearch></TaskSearch>
        <br>
        <CreatorTaskTable v-if="isAdmin || isManager"></CreatorTaskTable>
        <br>
        <ExecutorTaskTable v-if="isStaff || isManager"></ExecutorTaskTable>
    </div>
</template>

<script>
    import CreatorTaskTable from '@/components/tasks/CreatorTaskTable.vue';
    import TaskSearch from '@/components/tasks/TaskSearch.vue';
    import ExecutorTaskTable from "@/components/tasks/ExecutorTaskTable";
    import {mapGetters} from 'vuex';

    export default {
        name: "TaskPage",
        components: {ExecutorTaskTable, TaskSearch, CreatorTaskTable},
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