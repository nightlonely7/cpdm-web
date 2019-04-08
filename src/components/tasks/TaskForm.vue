<template>
    <div>
        <v-dialog v-model="dialog" fullscreen persistent>
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
                            <v-flex md12 sm12>
                                <v-text-field v-model="taskForm.title"
                                              label="Tiêu đề"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12 sm12>
                                <v-text-field v-model="taskForm.summary"
                                              label="Nội dung tổng quát"
                                ></v-text-field>
                            </v-flex>

                            <!--Start Date -->
                            <v-flex xs12 sm6 md6>
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
                                        <v-btn flat color="primary" @click="$refs.startDateDialog.save(startDate)">Lưu
                                        </v-btn>
                                    </v-date-picker>
                                </v-dialog>
                            </v-flex>

                            <!--End Date -->
                            <v-flex xs12 sm6 md6>
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

                            <!--Start Time -->
                            <v-flex xs12 sm6 md6>
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
                                                :disabled="startDate == null"
                                                v-on="on"
                                        ></v-text-field>
                                    </template>
                                    <v-time-picker
                                            v-if="startTimeMenu"
                                            v-model="startTime"
                                            full-width
                                            :min="creating ? (startDate === moment().format('YYYY-MM-DD') ? moment().format('HH:mm') : null) : null"
                                            :max="startDate === endDate ? endTime : null"
                                            locale="vi-vn"
                                    >
                                        <v-spacer></v-spacer>
                                        <v-btn flat color="primary" @click="startTimeMenu = false">Hủy
                                        </v-btn>
                                        <v-btn flat color="primary" @click="$refs.startTimeDialog.save(startTime)">Lưu
                                        </v-btn>
                                    </v-time-picker>
                                </v-dialog>
                            </v-flex>

                            <!--End Time -->
                            <v-flex xs12 sm6 md6>
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
                                <v-textarea v-model="taskForm.description"
                                            label="Nội dung chi tiết"
                                            height="500"
                                            outline
                                ></v-textarea>
                            </v-flex>

                            <v-flex md6 sm12>
                                <v-select v-model="taskForm.project.id"
                                          :items="projectOptions"
                                          item-value="id"
                                          label="Thuộc dự án"
                                          prepend-inner-icon="build"
                                          append-outer-icon="cached"
                                          @click:append-outer="getProjectOptions"
                                          :loading="projectOptionsLoading"
                                          @change="isManager && getParentTaskOptions(taskForm.project.id)"
                                >
                                    <template #item="{item}">
                                        {{item.name || ''}} - {{item.alias || ''}}
                                    </template>
                                    <template #selection="{item}">
                                        {{item.name || ''}} - {{item.alias || ''}}
                                    </template>
                                </v-select>
                            </v-flex>
                            <v-flex md6 sm12 v-if="isManager">
                                <v-select v-model="taskForm.parentTask.id"
                                          :items="parentTaskOptions"
                                          item-text="title"
                                          item-value="id"
                                          label="Tác vụ tổng"
                                          prepend-inner-icon="build"
                                          append-outer-icon="cached"
                                          @click:append-outer="!!taskForm.project.id && getParentTaskOptions(taskForm.project.id)"
                                          :loading="parentTaskOptionsLoading"
                                ></v-select>
                            </v-flex>
                            <v-flex md6 sm12>
                                <v-select v-model="taskForm.executor.id"
                                          :items="executorOptions"
                                          item-text="displayName"
                                          item-value="id"
                                          label="Người thực hiện"
                                          prepend-inner-icon="account_box"
                                ></v-select>
                            </v-flex>
                            <v-flex md6 sm12>
                                <v-text-field v-model="taskForm.priority"
                                              type="number"
                                              label="Mức độ ưu tiên"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12 sm12 v-if="relative">
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
                                        {{item.email}} - {{item.fullName}} - Phòng ban: {{item.department.name}}
                                    </template>
                                </v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-layout row justify-space-around>
                        <v-flex md2 sm4>
                            <v-btn color="secondary" @click="close" block>
                                <v-icon left>clear</v-icon>
                                <span>Hủy</span>
                            </v-btn>
                        </v-flex>
                        <v-flex md2 sm4>
                            <v-btn color="primary" @click="save" block>
                                <v-icon left>done</v-icon>
                                <span>Lưu</span>
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
    import {mapGetters} from "vuex";

    export default {
        name: "TaskForm",
        data() {
            return {
                dialog: false,
                relatives: [],
                executorOptions: [],
                projectOptions: [],
                projectOptionsLoading: false,
                parentTaskOptionsLoading: false,
                parentTaskOptions: [],
                viewerOptions: [],
                viewerOptionsLoading: false,
                viewerOptionsSearch: null,
                startDate: this.form.startDate,
                startTime: this.form.startTime,
                endDate: this.form.endDate,
                endTime: this.form.endTime,
                startDateMenu: false,
                startTimeMenu: false,
                endDateMenu: false,
                endTimeMenu: false,
            }
        },
        computed: {
            taskForm: function () {
                return {...this.form};
            },
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager'
            }),
        },
        props: {
            form: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        project: {id: null},
                        executor: {id: null},
                        parentTask: {id: null},
                    };
                }
            },
            relative: Boolean,
            creating: Boolean,
        },
        methods: {
            save: function () {
                const data = {
                    ...this.taskForm,
                    relatives: this.relatives.map(value => {
                        return {id: value};
                    }),
                };
                data.startTime = `${this.startDate} ${this.startTime}:00`;
                data.endTime = `${this.endDate} ${this.endTime}:00`;
                if (this.isAdmin) {
                    data.parentTask = null;
                }

                console.log(data);
                const url = `http://localhost:8080/tasks/${this.taskForm.id === 0 ? '' : this.taskForm.id}`;
                const method = `${this.taskForm.id === 0 ? 'POST' : 'PUT'}`;
                axios({url, method, data})
                    .then(() => {
                            this.close();
                            this.$emit('refresh');
                        }
                    ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                )
            },
            close: function () {
                this.dialog = false;
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
            getExecutorOptions: function () {

                const url = this.isAdmin ?
                    `http://localhost:8080/users/search/findAllManagerSummary` :
                    `http://localhost:8080/users/findAllStaffDisplayNameByDepartmentOfCurrentLoggedManager`;
                axios.get(url)
                    .then(response => {
                        this.executorOptions = response.data;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    });
            },
            getProjectOptions: function () {
                this.projectOptionsLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/projects`)
                        .then(response => {
                            this.projectOptions = response.data;
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                        .finally(() => {
                            this.projectOptionsLoading = false;
                        });
                }, 500);
            },
            getParentTaskOptions: function (projectId) {
                this.parentTaskOptionsLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/tasks/search/basicByExecutes`, {
                        params: {
                            projectId
                        }
                    })
                        .then(response => {
                            this.parentTaskOptions = response.data;
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                        .finally(() => {
                            this.parentTaskOptionsLoading = false;
                        });
                }, 500);
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.getExecutorOptions();
                this.getProjectOptions();
            });

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