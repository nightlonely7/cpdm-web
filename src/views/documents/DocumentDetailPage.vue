<template>
    <div>
        <DocumentDetail :id="id"></DocumentDetail>
        <br/>
    </div>
</template>

<script>
    import UploadButton from'vuetify-upload-button';
    import DocumentDetail from "../../components/documents/DocumentDetail";
    import axios from 'axios';
    import download from 'downloadjs';

    export default {
        name: "DocumentDetailPage",
        components: {DocumentDetail, UploadButton},
        data(){
            return {
                id: Number.parseInt(this.$route.params.id),
            }
        },
        methods: {
        },
        mounted() {
        },
    }
</script>

<style scoped>

</style>