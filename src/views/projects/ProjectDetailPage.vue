<template>
    <ProjectDetail :id="id"></ProjectDetail>
</template>

<script>
    import ProjectDetail from "../../components/projects/ProjectDetail";
    export default {
        name: "ProjectDetailPage",
        components: {ProjectDetail},
        data(){
            return{
                id: Number.parseInt(this.$route.params.id)
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>