<template>
    <div>
        <v-dialog v-model="dialog" persistent>
            <template #activator="{on}">
                <slot name="activator" :on="on"></slot>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">FORM</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex md12>
                                <v-text-field v-model="documentForm.title"
                                              label="Title"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-model="documentForm.summary"
                                              label="Summary"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-select v-model="documentForm.project.id"
                                          :items="projectOptions"
                                          item-value="id"
                                          label="Thuộc dự án"
                                          prepend-inner-icon="build"
                                >
                                    <template #item="{item}">
                                        {{item.name || ''}} - {{item.alias || ''}}
                                    </template>
                                    <template #selection="{item}">
                                        {{item.name || ''}} - {{item.alias || ''}}
                                    </template>
                                </v-select>
                            </v-flex>
                            <v-flex md6 sm12>
                                <v-text-field v-model="documentForm.startTime"
                                              label="Thời gian hiệu lực"
                                              prepend-inner-icon="event"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6 sm12>
                                <v-text-field v-model="documentForm.endTime"
                                              label="Thời gian hết hạn"
                                              prepend-inner-icon="event"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12 sm12>
                                <!--<v-textarea v-model="documentForm.description"-->
                                <!--label="Nội dung chi tiết"-->
                                <!--height="500"-->
                                <!--outline-->
                                <!--&gt;</v-textarea>-->
                                <span>Nội dung chi tiết:</span>
                                <ckeditor style="height: 500px" :editor="editor" v-model="documentForm.description"
                                          :config="editorConfig"></ckeditor>
                            </v-flex>
                            <v-flex md12 sm12>
                                <v-autocomplete chips deletable-chips cache-items multiple
                                                v-model="relatives"
                                                :items="viewerOptions"
                                                item-text="email"
                                                item-value="id"
                                                :loading="viewerOptionsLoading"
                                                :search-input.sync="viewerOptionsSearch"
                                                label="Người liên quan"
                                                clearable
                                                hide-no-data
                                >
                                    <template #item="{item}">
                                        {{item.email}} - {{item.fullName}} - Phòng ban:
                                        {{item.department.name}}
                                    </template>
                                </v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-layout row justify-space-around>
                        <v-flex md2>
                            <v-btn color="secondary" @click="close" block>
                                <v-icon left>clear</v-icon>
                                Cancel
                            </v-btn>
                        </v-flex>
                        <v-flex md2>
                            <v-btn color="primary" @click="save" block :loading="saveLoading">
                                <v-icon left>done</v-icon>
                                Save
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
    import '@ckeditor/ckeditor5-build-classic/build/translations/vi'

    export default {
        name: "DocumentForm",
        data() {
            return {
                saveLoading: false,
                relatives: [],
                viewerOptions: [],
                viewerOptionsLoading: false,
                viewerOptionsSearch: null,
                dialog: false,
                projectOptions: [],
                editor: ClassicEditor,
                editorConfig: {
                    language: 'vi',
                    toolbar: ['heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        'blockQuote',
                        'undo',
                        'redo'],
                    removePlugins: ['imageUpload'],
                },
            }
        },
        props: {
            form: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        project: {id: null},
                    };
                }
            }
        },
        computed: {
            documentForm() {
                return {...this.form};
            }
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.saveLoading = true;
                console.log(this.documentForm);
                const data = {
                    ...this.documentForm,
                    relatives: this.relatives.map(value => {
                        return {id: value};
                    }),
                };
                const method = 'POST';
                const url = `http://localhost:8080/documents`;
                axios({url, method, data})
                    .then(() => {
                        this.dialog = false;
                        this.$emit('refresh');
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    })
                    .finally(() => {
                        this.saveLoading = false;
                    });
            },
            getProjectOptions() {
                axios.get(`http://localhost:8080/projects/search/all`)
                    .then(response => {
                        this.projectOptions = response.data.content;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    });
            },
            getViewerOptions: function (email) {
                this.viewerOptionsLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/users/search/findAllForSelectByEmailContaining`, {
                        params: {
                            email: email,
                        }
                    }).then(response => {
                        if (response.status === 204) {
                            this.viewerOptions = [];
                            return;
                        }
                        this.viewerOptions = response.data;
                    }).catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    }).finally(() => {
                        this.viewerOptionsLoading = false;
                    });
                }, 500);
            },
        },
        mounted() {
            this.getProjectOptions();
        },
        created() {
            this.debouncedGetViewerOptions = _.debounce(this.getViewerOptions, 500);
        },
        watch: {
            viewerOptionsSearch: function (val) {
                if (val && !!val.length) {
                    this.debouncedGetViewerOptions(val);
                }
            },
            relatives: function () {
                this.viewerOptionsSearch = '';
            }
        }
    }
</script>

<style scoped>

</style>