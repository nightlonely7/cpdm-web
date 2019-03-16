<template>
    <div>
        <v-dialog v-model="showForm" persistent>
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
                                                   scrollable @change="formatStartDateText">
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
                                                   scrollable @change="formatEndDateText">
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

    export default {
        name: "TaskForm",
        data() {
            return {
                executorOptions: [],
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
                const taskForm = {...this.taskForm};
                taskForm.startTime = this.startDatePicker + " " + new Date().toLocaleTimeString().split(' ')[0];
                taskForm.endTime = this.endDatePicker + " " + new Date().toLocaleTimeString().split(' ')[0];
                console.log(taskForm.startTime);
                console.log(taskForm);

                const url = `http://localhost:8080/tasks/${taskForm.id === 0 ? '' : taskForm.id}`;
                const method = `${taskForm.id === 0 ? 'POST' : 'PUT'}`;
                axios.request(
                    {
                        url: url,
                        method: method,
                        data: taskForm
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
                );
            },
            close: function () {
                this.$store.commit('TASK_STORE/SET_SHOW_FORM', false);
            },
            formatStartDateText: function () {
                if (this.startDatePicker != null) {
                    let time = this.startDatePicker.split('-');
                    if (time[0].length === 4) {
                        this.taskForm.startTime = time[2] + '-' + time[1] + '-' + time[0];
                    }
                }
            },
            formatEndDateText: function () {
                if (this.endDatePicker != null) {
                    let time = this.endDatePicker.split('-');
                    if (time[0].length === 4) {
                        this.taskForm.endTime = time[2] + '-' + time[1] + '-' + time[0];
                    }
                }
            }
        },
        mounted() {
            axios.get(`http://localhost:8080/users/findAllStaffDisplayNameByDepartmentOfCurrentLoggedManager`)
                .then(response => {
                    this.executorOptions = response.data;
                });
        }
    }
</script>

<style scoped>
    .date-menu {
        width: 100%
    }
</style>