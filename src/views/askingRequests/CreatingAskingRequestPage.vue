<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <TaskTableForAsking title="TÁC VỤ PHỤ TRÁCH" getTasksURL="search/executes/notComplete"></TaskTableForAsking>
    </div>
</template>

<script>
    import TaskTableForAsking from "../../components/tasks/TaskTableForAsking";

    export default {
        name: "CreatingAskingRequestPage",
        components: {TaskTableForAsking},
    }
</script>

<style scoped>

</style>