<template>
    <v-dialog v-model="documentFileDialog">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">FORM TÀI LIỆU LIÊN QUAN</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-text-field v-model="form.filename"
                                          label="Tên tệp"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea v-model="form.description"
                                        label="Mô tả"
                            ></v-textarea>
                        </v-flex>
                        <v-flex xs12>
                            <UploadButton :fileChangedCallback="handleFileUpload"
                                          title="Chọn tệp tin"
                                          light
                                          v-if="documentFileDialog"
                            >
                                <template #icon-left>
                                    <v-icon left color="white">mdi-upload</v-icon>
                                </template>
                            </UploadButton>
                        </v-flex>
                        <v-flex xs12>
                            <p>Tệp tin sẽ tải: {{(!!file && file.name) || 'Chưa xác định'}}</p>
                        </v-flex>
                        <v-flex xs12>
                            <v-alert dismissible type="error" v-model="documentFileAlert">Tải lên thất bại</v-alert>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="secondary" @click="close">
                    <v-icon left>clear</v-icon>
                    <span>Hủy</span>
                </v-btn>
                <v-btn color="primary" @click="save" :loading="documentFileLoading">
                    <v-icon left>done</v-icon>
                    <span>Lưu</span>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from 'axios';
    import UploadButton from 'vuetify-upload-button';

    export default {
        name: "DocumentFileForm",
        components: {UploadButton},
        data(){
            return {
                documentFileDialog: false,
                documentFileLoading: false,
                documentFileAlert: false,
                file: null
            }
        },
        props: {
            document: Object,
            form: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        filename: '',
                        description: '',
                    }
                }
            },
            creating: Boolean,
        },
        methods: {
            close(){
                this.documentFileDialog = false;
            },
            save(){
                console.log("File: " + this.file);
                this.documentFileLoading = true;
                const data = new FormData();
                data.append('file', this.file);
                data.append('filename', this.form.filename);
                data.append('description', this.form.description);

                const method = this.creating ? 'POST' : 'PUT';
                const url = this.creating ?
                    `http://localhost:8080/documents/${this.document.id}/files` :
                    `http://localhost:8080/documents/files/${this.form.id}`;
                axios({
                    url, method, data,
                    config: {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                }).then((response) => {
                    console.log(response.data);
                    this.close();
                    this.$emit('refresh');
                }).catch((error) => {
                    console.log(error.response);
                    this.documentFileAlert = true;
                }).finally(() => {
                    this.documentFileLoading = false;
                    this.file = null;
                });
            },
            handleFileUpload(file) {
                if (file) {
                    this.file = file;
                    console.log(this.file);
                    this.form.filename = file.name.substring(0, file.name.lastIndexOf('.'));
                }
            },
        }
    }
</script>

<style scoped>

</style>