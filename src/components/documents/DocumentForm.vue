<template>
    <div>
        <v-dialog v-model="dialog" persistent fullscreen transition="dialog-bottom-transition">
            <template #activator="{on}">
                <slot name="activator" :on="on"></slot>
            </template>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click="dialog = false">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Tạo mới tài liệu</v-toolbar-title>
                </v-toolbar>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field v-model="documentForm.title"
                                              label="Tiêu đề"
                                              v-validate="{documentNameValidator: [documentTitle, creating]}"
                                              name="title"
                                              :rules="titleRule"
                                              validate-on-blur
                                ></v-text-field>
                                <p style="color: red">{{ errors.first('title') }}</p>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea v-model="documentForm.summary"
                                            label="Tóm tắt"
                                ></v-textarea>
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
                                                label="Thời gian bắt đầu"
                                                prepend-inner-icon="access_time"
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
                                               @click="$refs.startTimeDialog.save(startTime)">Lưu
                                        </v-btn>
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
                            <v-flex md12 sm12>
                                <v-checkbox v-model="selectAll" label="Chọn tất cả" color="blue" hide-details>
                                </v-checkbox>
                            </v-flex>
                            <v-flex md12 sm12 v-if="selectAll">
                                <span class="font-weight-bold">Danh sách phòng ban:</span>
                                <div v-for="department in departments">
                                    <v-checkbox v-model="selectedDepartments" :label="department.name"
                                                :value="department.id" hide-details disabled color="blue">
                                    </v-checkbox>
                                </div>
                            </v-flex>
                            <v-flex md12 sm12 v-else>
                                <span class="font-weight-bold">Danh sách phòng ban:</span>
                                <div v-for="department in departments">
                                    <v-checkbox v-model="selectedDepartments" :label="department.name"
                                                :value="department.id" hide-details color="blue">
                                    </v-checkbox>
                                </div>
                            </v-flex>
                            <v-flex md12 sm12 v-if="selectAll">
                                <v-checkbox label="Chọn tất cả quản lý" color="blue" hide-details>
                                </v-checkbox>
                            </v-flex>
                            <v-flex md12 sm12 v-else>
                                <v-checkbox v-model="selectAllManager" label="Chọn tất cả quản lý" color="blue"
                                            hide-details>
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
                                Hủy
                            </v-btn>
                        </v-flex>
                        <v-flex md2>
                            <v-btn color="primary" @click="save" block :loading="saveLoading">
                                <v-icon left>done</v-icon>
                                Lưu
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
                startDate: this.form.startDate,
                startTime: this.form.startTime,
                endDate: this.form.endDate,
                endTime: this.form.endTime,
                startDateMenu: false,
                startTimeMenu: false,
                endDateMenu: false,
                endTimeMenu: false,
                dateRules: [
                    val => !!val || "Không được để trống!",
                ],
                selectAll: false,
                selectAllManager: false,
                departments: [],
                selectedDepartments: []
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
                    };
                }
            },
            creating: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            documentTitle: {
                type: String,
                default: function () {
                    return '';
                }
            }
        },
        computed: {
            documentForm: function () {
                return {...this.form};
            },
        },
        mounted() {
            this.getProjectOptions();
            this.getDepartments();
            console.log(this.startDate)
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
                // console.log(this.selectedDepartments.join(','));
                axios({
                    url: url,
                    method: method,
                    data: data,
                    params: {
                        selectAll: this.selectAll,
                        departmentList: this.selectedDepartments.join(','),
                        selectAllManager: this.selectAllManager
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
            getViewerOptions(email) {
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
            getDepartments() {
                axios.get(`http://localhost:8080/departments`).then(
                    response => {
                        this.departments = response.data.content;
                        console.log(response.data.content);
                    }
                ).catch(
                    err => console.log(err)
                )
            }
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