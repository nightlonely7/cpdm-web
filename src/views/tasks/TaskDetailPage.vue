<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br>
        <br>
        <TaskDetail :id="id"></TaskDetail>
    </div>

</template>

<script>
    import TaskDetail from '@/components/tasks/TaskDetail';

    export default {
        name: "TaskDetailPage",
        components: {TaskDetail},
        data() {
            return {
                id: 0
            }
        },
        methods: {
            goBack: function () {
                this.$router.push("/tasks");
            }
        },
        mounted() {
            this.id = Number.parseInt(this.$route.params.id);
        }
    }
</script>

<style scoped>

</style>