<template>
    <v-expansion-panel v-model="taskFilePanel">
        <v-expansion-panel-content>

            <template #header>
                <span><v-icon left>mdi-paperclip</v-icon>Danh sách tệp tin</span>
            </template>

            <v-toolbar flat dense>
                <v-toolbar-items>
                    <v-divider vertical inset></v-divider>
                    <v-btn flat color="primary" @click="getTaskFiles">
                        <v-icon left>cached</v-icon>
                        <span>Tải lại</span>
                    </v-btn>
                    <v-divider vertical inset></v-divider>
                    <TaskFileForm :task="{...task}" @refresh="getTaskFiles" creating>
                        <template #activator="{ on }">
                            <v-btn v-on="on" flat color="primary">
                                <v-icon left>add</v-icon>
                                <span>Thêm tệp tin</span>
                            </v-btn>
                        </template>
                    </TaskFileForm>
                    <v-divider vertical inset></v-divider>
                </v-toolbar-items>
            </v-toolbar>
            <div class="text-xs-center" v-if="taskFileLoading">
                <br>
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

            <v-container v-if="taskFiles.length">
                <template v-for="(taskFile, index) in taskFiles">
                    <div :key="taskFile.id">
                        <br v-if="index !== 0">
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
                                    <span style="width: 25%; float: left">Thời điểm thêm vào</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(taskFile.createdTime).format('DD/MM/YYYY HH:mm:ss')}}
                                    </span>
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
                                    <span style="width: 25%; float: left">Thời điểm chỉnh sửa gần nhất</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(taskFile.lastModifiedTime).format('DD/MM/YYYY HH:mm:ss')}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Người chỉnh sửa gần nhất</span>
                                    <span style="width: 25%; float: left">
                                        {{taskFile.lastEditor.displayName}} - {{taskFile.lastEditor.email}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>

                            </v-card-text>
                            <v-card-actions>
                                <v-flex>
                                    <v-btn color="success" @click="downloadFile(taskFile.detailFilename)">
                                        <v-icon left>mdi-download</v-icon>
                                        <span>Tải về</span>
                                    </v-btn>
                                </v-flex>
                                <v-flex v-if="userId === taskFile.creator.id">
                                    <TaskFileForm :task="{...task}" :form="{...taskFile}"
                                                  @refresh="getTaskFiles">
                                        <template #activator="{ on }">
                                            <v-btn color="primary" v-on="on">
                                                <v-icon left>mdi-pencil</v-icon>
                                                <span>Sửa</span>
                                            </v-btn>
                                        </template>
                                    </TaskFileForm>
                                </v-flex>
                                <v-flex v-if="userId === taskFile.creator.id">
                                    <v-btn color="error" @click="deleteFile(taskFile.id)">
                                        <v-icon left>mdi-delete</v-icon>
                                        <span>Xóa</span>
                                    </v-btn>
                                </v-flex>
                            </v-card-actions>
                        </v-card>
                    </div>
                </template>
            </v-container>
            <br v-if="!taskFiles.length">
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>


    import axios from 'axios';
    import TaskFileForm from "./TaskFileForm";
    import download from 'downloadjs';
    import {mapState} from "vuex";

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
        computed: {
            ...mapState('AUTHENTICATION', {
                userId: state => state.id,
            }),
        },
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
                    .catch(error => console.log(error.response));
            },
            deleteFile(id) {
                if (confirm('Bạn muốn xóa tệp tin này chứ ?')) {
                    axios.delete(`http://localhost:8080/tasks/files/${id}`)
                        .then(() => {
                            this.getTaskFiles();
                        })
                        .catch(error => console.log(error.response));
                }
            }
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