<template>
    <div>
        <v-progress-circular v-if="loading"></v-progress-circular>
        <div v-if="!loading">
            <v-btn @click="goBack" color="primary">Trở về</v-btn>
            <br>
            <br>
            <TaskDetail :id="id"></TaskDetail>

            <br>

            <v-divider></v-divider>
            <br>
            <TaskComment :taskId="id"></TaskComment>
        </div>
    </div>
</template>

<script>
    import TaskDetail from '@/components/tasks/TaskDetail';

    import TaskComment from "../../components/tasks/TaskComment";

    export default {
        name: "TaskDetailPage",
        components: {TaskComment, TaskDetail},
        data() {
            return {
                loading: false,
            }
        },
        props: {
            id: Number,
        },
        methods: {
            goBack: function () {
                this.$router.back();
            },
        },

    }
</script>

<style scoped>

</style>