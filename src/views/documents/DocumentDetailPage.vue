<template>
    <DocumentDetail :id="id"></DocumentDetail>
</template>

<script>
    import DocumentDetail from "../../components/documents/DocumentDetail";
    export default {
        name: "DocumentDetailPage",
        components: {DocumentDetail},
        data(){
            return {
                id: Number.parseInt(this.$route.params.id)
            }
        }
    }
</script>

<style scoped>

</style>