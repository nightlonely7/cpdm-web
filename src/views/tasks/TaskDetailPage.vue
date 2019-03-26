<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br>
        <br>
        <TaskDetail :id="id"></TaskDetail>

        <br>

        <div>
            <v-card>
                <v-card-title>DANH SÁCH TỆP TIN</v-card-title>
                <v-card-text>
                    <p v-if="!taskFiles.length">Chưa có tệp tin</p>
                    <template v-for="taskFile in taskFiles">
                        <a @click.prevent="downloadFile(taskFile.filename)">{{taskFile.filename}}</a>
                        <br>
                    </template>
                    <br>
                    <p>TẢI LÊN TỆP TIN</p>
                    <UploadButton
                            :fileChangedCallback="handleFileUpload" @click="uploadFile" title="Chọn tệp tin"
                    ></UploadButton>
                    <span>Tệp tin sẽ tải: {{file.name || 'Chưa xác định'}}</span>
                    <v-btn v-if="!!file.name" color="primary" @click="uploadFile" :loading="loading">Tải lên</v-btn>
                    <span v-if="!!file.status"> | </span>
                    <b>{{file.status || ''}}</b>
                </v-card-text>
            </v-card>
        </div>
        <v-divider></v-divider>
        <br>
    </div>
</template>

<script>
    import TaskDetail from '@/components/tasks/TaskDetail';
    import UploadButton from 'vuetify-upload-button';
    import download from 'downloadjs';

    import axios from 'axios';

    export default {
        name: "TaskDetailPage",
        components: {TaskDetail, UploadButton},
        data() {
            return {
                file: {},
                loading: false,
                taskFiles: [],
            }
        },
        props: {
            id: Number,
        },
        methods: {
            init() {
                this.$store.commit('TASK_STORE/SET_TASK_ID', this.id);
                this.loadFilenames();
            },
            goBack: function () {
                this.$router.push("/tasks");
            },
            uploadFile: function () {
                this.loading = true;
                const formData = new FormData();
                formData.append('file', this.file);
                axios.post(`http://localhost:8080/tasks/${this.id}/files`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    console.log(response.data);
                    this.loading = false;
                    this.file.status = 'Tải lên thành công';
                    this.loadFilenames();
                }).catch((error) => {
                    console.log(error.response);
                    this.loading = false;
                    this.file.status = 'Tải lên thất bại';
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
                axios.get(`http://localhost:8080/downloadFile/${filename}`)
                    .then(response => {
                        download(response.data, filename, response.headers['Content-Type']);
                    })
            }
        },
        mounted() {
            this.init();
        },
    }
</script>

<style scoped>

</style>