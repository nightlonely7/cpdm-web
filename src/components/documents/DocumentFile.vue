<template>
    <v-expansion-panel v-model="documentFilePanel">
        <v-expansion-panel-content>
            <template #header>
                <span>
                <v-icon left>mdi-paperclip</v-icon>
                Danh sách tệp tin</span>
            </template>
            <v-toolbar flat dense>
                <v-toolbar-items>
                    <v-divider vertical inset></v-divider>
                    <v-btn flat color="primary" @click="getDocumentFiles">
                        <v-icon>cached</v-icon>
                        <span>&nbsp;Tải lại</span>
                    </v-btn>
                    <v-divider vertical inset></v-divider>
                    <DocumentFileForm :document="{...document}" @refresh="getDocumentFiles" creating>
                        <template #activator="{ on }">
                            <v-btn v-on="on" flat color="primary">
                                <v-icon>add</v-icon>
                                <span>Thêm tệp tin</span>
                            </v-btn>
                        </template>
                    </DocumentFileForm>
                    <v-divider vertical inset></v-divider>
                </v-toolbar-items>
            </v-toolbar>
            <div class="text-xs-center" v-if="documentFileLoading">
                <br>
                <v-progress-circular indeterminate
                                     size="64"
                                     width="8"
                                     color="primary"
                ></v-progress-circular>
                <br>
            </div>
            <div class="text-xs-center" v-if="!documentFileLoading && !documentFiles.length">
                <br>
                <span>Không có tệp tin nào!</span>
            </div>
            <v-container v-if="documentFiles.length">
                <template v-for="documentFile in documentFiles">
                    <div :key="documentFile.id">
                        <v-card>
                            <v-card-text>
                                <p>
                                    <span style="width: 25%; float: left">Tên tệp</span>
                                    <span style="width: 75%; float: left"><b>{{documentFile.filename}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Định dạng</span>
                                    <span style="width: 75%; float: left"><b>{{documentFile.extension}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Tên đầy đủ</span>
                                    <span style="width: 75%; float: left"><b>{{documentFile.detailFilename}}</b></span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Mô tả</span>
                                    <span style="width: 75%; float: left"> {{documentFile.description}}</span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời điểm thêm vào</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(documentFile.createdTime).format('DD/MM/YYYY HH:mm:ss')}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Người thêm vào</span>
                                    <span style="width: 25%; float: left">
                                        {{documentFile.creator.displayName}} - {{documentFile.creator.email}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Thời điểm chỉnh sửa gần nhất</span>
                                    <span style="width: 25%; float: left">
                                        {{moment(documentFile.lastModifiedTime).format('DD/MM/YYYY HH:mm:ss')}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                                <br>

                                <p>
                                    <span style="width: 25%; float: left">Người chỉnh sửa gần nhất</span>
                                    <span style="width: 25%; float: left">
                                        {{documentFile.lastEditor.displayName}} - {{documentFile.lastEditor.email}}
                                    </span>
                                </p>

                                <br>
                                <v-divider></v-divider>
                            </v-card-text>
                            <v-card-actions>
                                <v-flex>
                                    <v-btn color="success" @click="downloadFile(documentFile.detailFilename)">
                                        <v-icon left>mdi-download</v-icon>
                                        <span>Tải về</span>
                                    </v-btn>
                                </v-flex>
                                <v-flex>
                                    <DocumentFileForm :document="{...document}" :form="{...documentFile}"
                                                      @refresh="getDocumentFiles">
                                        <template #activator="{ on }">
                                            <v-btn color="primary" v-on="on">
                                                <v-icon left>mdi-pencil</v-icon>
                                                <span>Sửa</span>
                                            </v-btn>
                                        </template>
                                    </DocumentFileForm>
                                </v-flex>
                                <v-flex>
                                    <v-btn color="error" @click="deleteFile(documentFile.id)">
                                        <v-icon left>mdi-delete</v-icon>
                                        <span>Xóa</span>
                                    </v-btn>
                                </v-flex>
                            </v-card-actions>
                        </v-card>
                        <br>
                    </div>
                </template>
            </v-container>
            <br/>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import DocumentFileForm from "./DocumentFileForm";
    import axios from 'axios';
    import download from 'downloadjs';

    export default {
        name: "DocumentFile",
        components: {DocumentFileForm},
        data() {
            return {
                documentFilePanel: null,
                documentFiles: [],
                documentFileLoading: false,
                documentFileLoaded: false,
            }
        },
        props: {
            document: Object
        },
        methods: {
            getDocumentFiles() {
                this.documentFileLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/documents/${this.document.id}/files`)
                        .then(response => {
                            this.documentFiles = response.data;
                            this.documentFileLoaded = true;
                        })
                        .catch(error => console.log(error.response))
                        .finally(() => this.documentFileLoading = false);
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
                    axios.delete(`http://localhost:8080/documents/files/${id}`)
                        .then(() => {
                            this.getDocumentFiles();
                        })
                        .catch(error => console.log(error.response));
                }
            }
        },
        watch: {
            documentFilePanel(val) {
                if (val === 0) {
                    if (!this.documentFileLoaded) {
                        this.getDocumentFiles();
                    }
                }
            },
        },
    }
</script>

<style scoped>

</style>