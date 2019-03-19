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
                                              label="Title"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-model="taskForm.summary"
                                              label="Summary"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field v-model="taskForm.startTime"
                                              label="Start Time"
                                              prepend-inner-icon="event"
                                ></v-text-field>
                            </v-flex>
                            <v-flex>
                                <v-text-field v-model="taskForm.endTime"
                                              label="End Time"
                                              prepend-inner-icon="event"
                                ></v-text-field>
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
                            <v-btn color="primary" @click="save" block>
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
    import {mapState} from 'vuex'
    import _ from 'lodash';

    export default {
        name: "TaskForm",
        data() {
            return {
                relatives: [],
                executorOptions: [],
                projectOptions: [{id: 0, name: 'Không dự án'}],
                viewerOptions: [],
                viewerOptionsLoading: false,
                viewerOptionsSearch: null,
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
                console.log(data);

                const url = `http://localhost:8080/tasks/${this.taskForm.id === 0 ? '' : this.taskForm.id}`;
                const method = `${this.taskForm.id === 0 ? 'POST' : 'PUT'}`;
                axios.request(
                    {
                        url: url,
                        method: method,
                        data: data
                    }
                ).then(() => {
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

</style>