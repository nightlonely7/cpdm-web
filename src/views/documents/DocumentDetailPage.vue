<template>
    <div>
        <DocumentDetail :id="id"></DocumentDetail>
        <br/>
        <div>
            <v-card>
                <v-card-title>DANH SÁCH TỆP TIN</v-card-title>
                <v-card-text>
                    <p v-if="!taskFiles.length">Chưa có tệp tin</p>
                    <template v-for="taskFile in taskFiles">
                        <div :key="taskFile.id">
                            <a @click.prevent="downloadFile(taskFile.filename)">
                                {{taskFile.filename}}</a>
                            <br>
                        </div>
                    </template>
                    <br>
                    <p>TẢI LÊN TỆP TIN</p>
                    <UploadButton
                            :fileChangedCallback="handleFileUpload" @click="uploadFile" title="Chọn tệp tin"
                    ></UploadButton>
                    <span>Tệp tin sẽ tải: {{(!!file && file.name) || 'Chưa xác định'}}</span>
                    <v-btn v-if="!!file && !!file.name" color="primary" @click="uploadFile"
                           :loading="uploadFileLoading">Tải
                        lên
                    </v-btn>
                    <span v-if="(!!file && !!file.status)"> | </span>
                    <b>{{(!!file && file.status) || ''}}</b>
                </v-card-text>
            </v-card>
        </div>
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
                loading: false,
                file: {},
                uploadFileLoading: false,
                taskFiles: [],
            }
        },
        methods: {
            init() {
                this.loadFilenames();
            },
            uploadFile: function () {
                this.uploadFileLoading = true;
                const formData = new FormData();
                formData.append('file', this.file);
                axios.post(`http://localhost:8080/tasks/${this.id}/files`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    console.log(response.data);
                    this.file.status = 'Tải lên thành công';
                    this.loadFilenames();
                }).catch((error) => {
                    console.log(error.response);
                    this.file.status = 'Tải lên thất bại';
                }).finally(() => {
                    this.uploadFileLoading = false;
                    this.file = null;
                });
            },
            handleFileUpload: function (file) {
                this.file = file;
                console.log(file);
            },
            loadFilenames: function () {
                axios.get(`http://localhost:8080/tasks/${this.id}/files`)
                    .then(response => {
                        this.taskFiles = response.data
                    })
                    .catch(error => console.log(error.response))
            },
            downloadFile: function (filename) {
                axios.get(`http://localhost:8080/downloadFile/${filename}`, {responseType: 'blob',})
                    .then(response => {
                        download(response.data, filename, response.headers['Content-Type']);
                    })
            }
        },
        mounted() {
            this.loading = true;
            this.init();
            this.loading = false;
        },
    }
</script>

<style scoped>

</style>