<template>
    <v-expansion-panel v-model="taskFilePanel">
        <v-expansion-panel-content>

            <template #header>
                <span>
                <v-icon left>mdi-paperclip</v-icon>
                Danh sách tệp tin</span>
            </template>

            <v-toolbar flat dense>
                <v-toolbar-items>
                    <v-divider vertical inset></v-divider>
                    <v-btn flat color="primary" @click="getTaskFiles">
                        <v-icon>cached</v-icon>
                        <span>&nbsp;Tải lại</span>
                    </v-btn>
                    <v-divider vertical inset></v-divider>
                    <TaskFileForm :task="{...task}" @refresh="getTaskFiles" creating>
                        <template #activator="{ on }">
                            <v-btn v-on="on" flat color="primary">
                                <v-icon>add</v-icon>
                                <span>&nbsp;Thêm tệp tin</span>
                            </v-btn>
                        </template>
                    </TaskFileForm>
                    <v-divider vertical inset></v-divider>
                    <v-btn flat>Link Three</v-btn>
                </v-toolbar-items>
                <!--<template #extension>-->
                <!--<hr>-->
                <!--<hr>-->
                <!--<span>Tìm kiếm</span>-->
                <!--</template>-->
            </v-toolbar>
            <div class="text-xs-center" v-if="taskFileLoading">
                <v-progress-circular indeterminate
                                     size="64"
                                     width="8"
                                     color="primary"
                ></v-progress-circular>
                <br>
            </div>
            <div class="text-xs-center" v-if="!taskFileLoading && !taskFiles.length">
                <br>
                <span>Không có tệp tin nào</span>
            </div>
            <v-container>
                <template v-for="taskFile in taskFiles">
                    <div :key="taskFile.id">
                        <v-card>
                            <v-card-text>
                                <p>
                                    <span style="width: 25%; float: left">Tên tệp</span>
                                    <span style="width: 75%; float: left"><b>{{taskFile.filename}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Định dạng</span>
                                    <span style="width: 75%; float: left"><b>{{taskFile.extension}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Tên đầy đủ</span>
                                    <span style="width: 75%; float: left"><b>{{taskFile.detailFilename}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Mô tả</span>
                                    <span style="width: 75%; float: left"> {{taskFile.description}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Người thêm vào</span>
                                    <span style="width: 25%; float: left">
                                        {{taskFile.creator.displayName}} - {{taskFile.creator.email}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời điểm thêm vào</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(taskFile.createdTime).format('DD/MM/YYYY HH:mm:ss')}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời điểm chỉnh sửa gần nhất</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(taskFile.lastModifiedTime).format('DD/MM/YYYY HH:mm:ss')}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>

                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="success" @click="downloadFile(taskFile.detailFilename)">
                                    <v-icon left>mdi-download</v-icon>
                                    <span>Tải về</span>
                                </v-btn>
                                <TaskFileForm :task="{...task}" :form="{...taskFile}">
                                    <template #activator="{ on }">
                                        <v-btn color="primary" v-on="on">
                                            <v-icon left>mdi-pencil</v-icon>
                                            <span>Sửa</span>
                                        </v-btn>
                                    </template>
                                </TaskFileForm>
                            </v-card-actions>
                        </v-card>
                        <br>
                    </div>

                </template>
            </v-container>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>


    import axios from 'axios';
    import TaskFileForm from "./TaskFileForm";
    import download from 'downloadjs';

    export default {
        name: "TaskFile",
        components: {TaskFileForm},
        data() {
            return {
                taskFilePanel: null,
                taskFileLoading: false,
                taskFileLoaded: false,
                taskFiles: [],
            }
        },
        props: {
            task: Object,
        },
        computed: {},
        methods: {
            getTaskFiles() {
                this.taskFileLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/tasks/${this.task.id}/files`)
                        .then(response => {
                            this.taskFiles = response.data;
                            this.taskFileLoaded = true;
                        })
                        .catch(error => console.log(error.response))
                        .finally(() => this.taskFileLoading = false);
                }, 500);
            },
            downloadFile(filename) {
                axios.get(`http://localhost:8080/downloadFile/${filename}`, {responseType: 'blob',})
                    .then(response => {
                        download(response.data, filename, response.headers['Content-Type']);
                    })
            },
        },
        mounted() {

        },
        watch: {
            taskFilePanel(val) {
                if (val === 0) {
                    if (!this.taskFileLoaded) {
                        this.getTaskFiles();
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>