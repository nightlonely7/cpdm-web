<template>
    <div>
        <v-dialog v-model="dialog" persistent>
            <template #activator="{on}">
                <slot name="activator" :on="on"></slot>
            </template>
            <v-card>
                <v-snackbar v-model="snackbar" :top="true" :absolute="true" :timeout="timeout">
                    {{serverErrorText}}
                    <v-btn color="info" @click="snackbar = false">
                        Đóng
                    </v-btn>
                </v-snackbar>
                <v-card-title>
                    <span class="headline">FORM</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-container>
                            <v-layout wrap>
                                <v-flex md12>
                                    <v-text-field label="Tên dự án"
                                                  counter="50"
                                                  v-model="projectForm.name"
                                                  :rules="nameRule"
                                                  name="name"
                                                  v-validate="{projectNameValidator: [projectName, creating]}"
                                                  validate-on-blur>
                                        >
                                    </v-text-field>
                                    <p style="color: red">{{ errors.first('name') }}</p>
                                </v-flex>
                                <v-flex md12>
                                    <v-text-field label="Mã dự án"
                                                  v-model="projectForm.alias"
                                                  counter="50"
                                                  :rules="aliasRule"
                                                  name="alias"
                                                  v-validate="{projectAliasValidator: [projectAlias, creating]}"
                                                  validate-on-blur
                                    ></v-text-field>
                                    <p style="color: red">{{ errors.first('alias') }}</p>
                                </v-flex>
                                <v-flex md12 sm12>
                                    <br>
                                    <br>
                                    <br>
                                    <span class="font-weight-bold">Nội dung chi tiết:</span>
                                    <br>
                                    <br>
                                    <ckeditor style="height: 500px" :editor="editor" v-model="projectForm.description"
                                              :config="editorConfig"></ckeditor>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="secondary" @click="close">
                        <v-icon left>clear</v-icon>
                        Hủy
                    </v-btn>
                    <v-btn color="primary" @click="save">
                        <v-icon left>done</v-icon>
                        Lưu
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import {mapState} from 'vuex'
    import 'vee-validate'
    import _ from 'lodash'
    import moment from 'moment'
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    import '@ckeditor/ckeditor5-build-classic/build/translations/vi';

    export default {
        name: "ProjectForm",
        data() {
            return {
                project: {},
                nameRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!"
                ],
                aliasRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!"
                ],
                snackbar: false,
                serverErrorText: 'Lưu thông tin thất bại!',
                timeout: 10000,
                dialog: false,
                editor: ClassicEditor,
                editorConfig: {
                    language: 'vi',
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList',
                        'numberedList', 'blockQuote', 'undo', 'redo'],
                    removePlugins: ['imageUpload'],
                },
            }
        },
        computed: {
        },
        props: {
            projectForm: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        name: '',
                        alias: '',
                        description: ''
                    }
                }
            },
            creating: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            projectName: {
                type: String,
                default: function () {
                    return '';
                }
            },
            projectAlias: {
                type: String,
                default: function () {
                    return '';
                }
            }
        },
        mounted() {

        },
        methods: {
            close: function () {
                this.snackbar = false;
                this.dialog = false;
            },
            save: function () {
                const projectForm = {...this.projectForm};
                if (this.$refs.form.validate() && this.errors.all().length === 0) {
                    const url = `http://localhost:8080/projects${projectForm.id === 0 ? `` : ('/' + projectForm.id)}`;
                    const method = projectForm.id === 0 ? 'POST' : 'PUT';
                    axios({
                        url: url,
                        method: method,
                        data: projectForm
                    }).then(
                        () => {
                            this.close();
                            this.$emit("refresh");
                        }
                    ).catch(
                        err => {
                            this.snackbar = true;
                            console.log(err);
                        }
                    )
                }
            }
        }
    }
</script>

<style scoped>

</style>