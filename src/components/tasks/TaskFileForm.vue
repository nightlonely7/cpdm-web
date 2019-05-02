<template>
    <v-dialog width="500" v-model="taskFileDialog">
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
                        <v-flex xs12 v-if="creating">
                            <UploadButton :fileChangedCallback="handleFileUpload"
                                          title="Chọn tệp tin"
                                          light
                            >
                                <template #icon-left>
                                    <v-icon left color="white">mdi-upload</v-icon>
                                </template>
                            </UploadButton>
                        </v-flex>
                        <v-flex xs12 v-if="creating">
                            <p>Tệp tin sẽ tải: {{(!!file && file.name) || 'Chưa xác định'}}</p>
                        </v-flex>
                        <v-flex xs12 v-if="creating">
                            <v-alert dismissible type="error" v-model="taskFileAlert">Tải lên thất bại</v-alert>
                        </v-flex>

                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="secondary" @click="close">
                    <v-icon left>clear</v-icon>
                    <span>Hủy</span>
                </v-btn>
                <v-btn color="primary" @click="save" :loading="taskFileLoading">
                    <v-icon left>done</v-icon>
                    <span>Lưu</span>
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
    import UploadButton from 'vuetify-upload-button';
    import axios from 'axios';

    export default {
        name: "TaskFileForm",
        components: {UploadButton},
        props: {
            task: Object,
            form: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        filename: '',
                        description: '',
                    };
                }
            },
            creating: Boolean,
        },
        data() {
            return {
                file: null,
                taskFileDialog: false,
                taskFileLoading: false,
                taskFileAlert: false,
            }
        },
        methods: {
            close() {
                this.taskFileDialog = false;
            },
            save() {
                this.taskFileLoading = true;
                const formData = new FormData();
                formData.append('file', this.file);
                formData.append('filename', this.form.filename);
                formData.append('description', this.form.description);
                axios.post(`http://localhost:8080/tasks/${this.task.id}/files`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then((response) => {
                    console.log(response.data);
                    this.close();
                    this.$emit('refresh');
                }).catch((error) => {
                    console.log(error.response);
                    this.taskFileAlert = true;
                }).finally(() => {
                    this.taskFileLoading = false;
                    this.file = null;
                });
            },
            handleFileUpload(file) {
                this.file = file;

                console.log(file);
            },
        },
    }
</script>

<style scoped>

</style>