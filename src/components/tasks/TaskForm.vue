<template>
    <div>
        <v-dialog v-model="showForm" fullscreen persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">FORM</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex md12>
                                <v-text-field v-model="taskForm.title"
                                              label="Tên công việc"
                                              :rules="titleRule"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-model="taskForm.summary"
                                              label="Tóm tắt"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-menu right offset-x class="date-menu">
                                    <v-text-field v-model="taskForm.startTime"
                                                  label="Ngày bắt đầu"
                                                  prepend-inner-icon="event"
                                                  slot="activator"
                                    ></v-text-field>
                                    <v-date-picker v-model="startDatePicker" label="Ngày bắt đầu" color="green"
                                                   scrollable>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex>
                                <v-menu bottom offset-y class="date-menu">
                                    <v-text-field v-model="taskForm.endTime"
                                                  label="Ngày kết thúc"
                                                  prepend-inner-icon="event"
                                                  slot="activator"
                                    ></v-text-field>
                                    <v-date-picker v-model="endDatePicker" label="Ngày kết thúc" color="green"
                                                   scrollable>
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex md12>
                                <v-textarea v-model="taskForm.description"
                                            label="Nội dung chi tiết"
                                            height="500"
                                            outline
                                ></v-textarea>
                            </v-flex>
                            <v-flex>
                                <v-select v-model="taskForm.project.id"
                                          :items="projectOptions"
                                          item-value="id"
                                          label="Thuộc dự án"
                                          prepend-inner-icon="build"
                                >
                                    <template #item="{item}">
                                        {{item.name || ''}}{{item.id === 1 ? '' : ' - '}}{{item.alias || ''}}
                                    </template>
                                    <template #selection="{item}">
                                        {{item.name || ''}}{{item.id === 1 ? '' : ' - '}}{{item.alias || ''}}
                                    </template>
                                </v-select>
                            </v-flex>
                            <v-flex>
                                <v-select v-model="taskForm.executor.id"
                                          :items="executorOptions"
                                          item-text="displayName"
                                          item-value="id"
                                          label="Người thực hiện"
                                          prepend-inner-icon="account_box"
                                ></v-select>
                            </v-flex>
                            <v-flex>
                                <v-text-field v-model="taskForm.priority"
                                              type="number"
                                              label="Mức độ ưu tiên"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
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

                                    <template slot="item" slot-scope="data">

                                        {{data.item.email}} - {{data.item.fullName}} - Phòng ban:
                                        {{data.item.department.name}}
                                    </template>
                                </v-autocomplete>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="secondary" @click="close">
                        <v-icon left>clear</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="save">
                        <v-icon left>done</v-icon>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex'
    import _ from 'lodash';
    import 'moment'

    export default {
        name: "TaskForm",
        data() {
            return {
                relatives: [],
                executorOptions: [],
                viewerOptions: [],
                viewerOptionsLoading: false,
                viewerOptionsSearch: null,
                titleRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val && val.length >= 4 && val.length <= 50)
                        || 'Cần phải điền từ 4 tới 50 ý tự!'
                ],
                startDatePicker: '',
                endDatePicker: ''
            }
        },
        computed: {
            ...mapState('TASK_STORE', {
                showForm: state => state.showForm,
                taskForm: state => state.taskForm
            })
        },
        methods: {
            save: function () {
                console.log(this.relatives);
                const data = {
                    ...this.taskForm,
                    relatives: this.relatives.map(value => {
                        return {id: value};
                    }),
                };

                moment.format();
                console.log(data);

                const url = `http://localhost:8080/tasks/${this.taskForm.id === 0 ? '' : this.taskForm.id}`;
                const method = `${this.taskForm.id === 0 ? 'POST' : 'PUT'}`;
                axios({url, method, data})
                    .then(() => {
                        this.close();
                        this.$emit('refresh');
                    })
                    .catch(error => {
                            if (error.response) {
                                console.log(error.response.data)
                            }
                        }
                    )
            },
            close: function () {
                this.$store.commit('TASK_STORE/SET_SHOW_FORM', false);
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
                axios.get(`http://localhost:8080/users/findAllStaffDisplayNameByDepartmentOfCurrentLoggedManager`)
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
                axios.get(`http://localhost:8080/projects`)
                    .then(response => {
                        this.projectOptions = response.data;
                        console.log(this.projectOptions)
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    });
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.getExecutorOptions();
                this.getProjectOptions();
                console.log(this.taskForm)
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
    .date-menu {
        width: 100%
    }
</style>