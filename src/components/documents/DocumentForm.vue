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
                                              label="Tiêu đề"
                                              v-validate="{depNameValidator: [documentTitle, creating]}"
                                              name="title"
                                              :rules="titleRule"
                                              validate-on-blur
                                ></v-text-field>
                                <p style="color: red">{{ errors.first('title') }}</p>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-model="documentForm.summary"
                                              label="Tóm tắt"
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
                                <v-dialog
                                        ref="startDateDialog"
                                        v-model="startDateMenu"
                                        :return-value.sync="startDate"
                                        persistent
                                        lazy
                                        full-width
                                        width="300px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="startDate"
                                                label="Ngày bắt đầu"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                                :rules="dateRules"
                                                validate-on-blur
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="startDateMenu"
                                            v-model="startDate"
                                            full-width
                                            :min="creating ? moment().format('YYYY-MM-DD') : null"
                                            :max="endDate"
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="startDateMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary" @click="$refs.startDateDialog.save(startDate)">
                                            Lưu
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>
                            <v-flex md6 sm12>
                                <v-dialog
                                        ref="endDateDialog"
                                        v-model="endDateMenu"
                                        :return-value.sync="endDate"
                                        persistent
                                        lazy
                                        full-width
                                        width="300px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="endDate"
                                                label="Ngày kết thúc"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                                :rules="dateRules"
                                                validate-on-blur
                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-if="endDateMenu"
                                            v-model="endDate"
                                            full-width
                                            :min="startDate ? startDate : creating ? moment().format('YYYY-MM-DD') : null"
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="endDateMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary" @click="$refs.endDateDialog.save(endDate)">Lưu
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>
                            <v-flex md6 sm12>
                                <v-dialog
                                        ref="startTimeDialog"
                                        v-model="startTimeMenu"
                                        :return-value.sync="startTime"
                                        persistent
                                        lazy
                                        full-width
                                        width="300px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="startTime"
                                                label="Ngày kết thúc"
                                                prepend-inner-icon="mdi-calendar"
                                                readonly
                                                clearable
                                                v-on="on"
                                                :rules="dateRules"
                                                validate-on-blur
                                        ></v-text-field>
                                    </template>
                                    <v-time-picker
                                            v-model="startTime"
                                            full-width
                                            :min="creating ? (startDate === moment().format('YYYY-MM-DD') ? moment().format('HH:mm') : null) : null"
                                            :max="startDate === endDate ? endTime : null"
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="startTimeMenu = false">Hủy</v-btn>
                                        <v-btn flat color="primary"
                                               @click="$refs.startTimeDialog.save(startTime)">Lưu</v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-flex>
                            <v-flex md6 sm12>
                                <v-dialog
                                        ref="endTimeDialog"
                                        v-model="endTimeMenu"
                                        :return-value.sync="endTime"
                                        persistent
                                        lazy
                                        full-width
                                        width="300px"
                                >
                                    <template #activator="{ on }">
                                        <v-text-field
                                                v-model="endTime"
                                                label="Thời gian kết thúc"
                                                prepend-inner-icon="access_time"
                                                readonly
                                                clearable
                                                :disabled="endDate == null"
                                                v-on="on"
                                                :rules="dateRules"
                                                validate-on-blur
                                        ></v-text-field>
                                    </template>
                                    <v-time-picker
                                            v-if="endTimeMenu"
                                            v-model="endTime"
                                            full-width
                                            :min="startTime ?
                                            (startDate === endDate ? startTime : null) :
                                            creating ?
                                            (startDate === moment().format('YYYY-MM-DD') ? moment().format('HH:mm') : null) :
                                            null"
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="endTimeMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary" @click="$refs.endTimeDialog.save(endTime)">Lưu
                                        </v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-flex>
                            <v-flex md12 sm12>
                                <br>
                                <br>
                                <br>
                                <span class="font-weight-bold">Nội dung chi tiết:</span>
                                <br>
                                <br>
                                <ckeditor style="height: 500px" :editor="editor" v-model="documentForm.description"
                                          :config="editorConfig"></ckeditor>
                            </v-flex>
                            <v-flex md4 sm4>
                                <v-checkbox v-model="selectAll" label="Chọn tất cả phòng ban" color="blue">
                                </v-checkbox>
                            </v-flex>
                            <v-flex md4 sm4>
                                <v-checkbox label="Mọi phòng ban">
                                </v-checkbox>
                            </v-flex>
                            <v-flex md4 sm4>
                                <v-checkbox label="Mọi quản lí">
                                </v-checkbox>
                            </v-flex>
                            <v-flex md12 sm12>
                                <v-autocomplete label="Người liên quan"
                                                hide-no-data
                                                disabled
                                                v-if="selectAll"
                                ></v-autocomplete>
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
                                                v-else
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
    import '@ckeditor/ckeditor5-build-classic/build/translations/vi';
    import moment from 'moment';

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
                    toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList',
                        'numberedList', 'blockQuote', 'undo', 'redo'],
                    removePlugins: ['imageUpload'],
                },
                titleRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val.length >= 4 && val.length <= 50) || "Phải điền từ 4 tới 50 kí tự!"
                ],
                documentTitle: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                startDateMenu: false,
                startTimeMenu: false,
                endDateMenu: false,
                endTimeMenu: false,
                dateRules: [
                    val => !!val || "Không được để trống!",
                ],
                selectAll: false
            }
        },
        props: {
            form: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        title: '',
                        project: {id: null},
                        endTime: '',
                        startTime: '',
                        createdTime: '',
                    };
                }
            },
            creating: {
                type: Boolean,
                default: function () {
                    return false;
                }
            }
        },
        computed: {
            documentForm: function () {
                return {
                    ...this.form,
                    startDate: moment(this.form.startTime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'),
                    startTime: moment(this.form.startTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm'),
                    endDate: moment(this.form.endTime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'),
                    endTime: moment(this.form.endTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm'),
                };
            },
        },
        mounted() {
            if (this.documentForm.id !== 0) {
                this.documentTitle = this.documentForm.title;
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
                    relatives: this.selectAll ? null : this.relatives.map(value => {
                        return {id: value};
                    }),
                };
                data.startTime = `${this.startDate} ${this.startTime}:00`;
                data.endTime = `${this.endDate} ${this.endTime}:00`;
                console.log(data.startTime + "/" + data.endTime);
                const method = data.id === 0 ? 'POST' : 'PUT';
                const url = `http://localhost:8080/documents` + (data.id === 0 ? `` : `/${data.id}`);
                console.log(data.id);
                axios({
                    url: url,
                    method: method,
                    data: data,
                    params: {
                        selectAll: this.selectAll
                    }
                })
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
                        this.projectOptions = response.data;
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
            },
        }
    }
</script>

<style scoped>
    .ck-editor__editable {
        min-height: 500px;
    }
</style>