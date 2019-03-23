<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
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
            goBack: function () {
                this.$router.push('/tasks');
            }
        }
    }
</script>

<style scoped>

</style>