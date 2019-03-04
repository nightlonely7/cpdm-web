<template>
    <div>
        <TaskSearch></TaskSearch>
        <TaskTable></TaskTable>
    </div>
</template>

<script>
    import TaskTable from "@/components/tasks/TaskTable.vue";
    import TaskSearch from "@/components/tasks/TaskSearch";

    export default {
        name: "TaskPage",
        components: {TaskSearch, TaskTable}
    }
</script>

<style scoped>

</style>