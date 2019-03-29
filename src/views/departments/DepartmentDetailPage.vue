<template>
    <div>
        <DepartmentDetail :id="id"></DepartmentDetail>
    </div>
</template>

<script>
    import DepartmentDetail from "@/components/departments/DepartmentDetail";

    export default {
        name: "DepartmentDetailPage",
        components: {DepartmentDetail},
        data(){
            return{
                id: Number.parseInt(this.$route.params.id)
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>