<template>
    <v-dialog v-model="activate" persistent>
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
                            <v-select v-model="taskForm.executor.id"
                                      :items="executorOptions"
                                      item-text="displayName"
                                      item-value="id"
                                      label="Executor"
                                      prepend-inner-icon="account_box"
                            ></v-select>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="taskForm.priority"
                                          type="number"
                                          label="Priority"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
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
</template>

<script>
    import axios from 'axios';

    export default {
        name: "TaskForm",
        data() {
            return {
                executorOptions: [{id: 0, displayName: ''}],
                taskForm: {
                    title: '',
                    summary: '',
                    description: '',
                    startTime: '',
                    endTime: '',
                    executor: {id: 0},
                    status: '',
                    priority: 0
                }
            }
        },
        props: {
            activate: Boolean,
            currentTask: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        title: '',
                        summary: '',
                        description: '',
                        startTime: '',
                        endTime: '',
                        executor: {id: 0},
                        status: '',
                        priority: 0
                    }
                }
            }
        },
        methods: {
            save: function () {

                console.log(this.taskForm);
                const url = `http://localhost:8080/tasks/${this.currentTask.id === 0 ? '' : this.currentTask.id}`;
                const method = `${this.currentTask.id === 0 ? 'POST' : 'PUT'}`;
                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.taskForm,
                        headers: {
                            'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGFuaG5wQGdtYWlsLmNvbSIsImV4cCI6MTU1MTYxMTA5N30.uKQtiMqFMbG0NFaGkRmReHdKdj3OP8rK7J8KfUeDEGEqTu0JHop-ZBBir1067I57pV7eOzes8sY3w7pW6xe6Kg'
                        }
                    }).then(response => {
                        this.close();
                        this.$emit('refresh');
                    }
                ).catch(
                    error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            close: function () {
                this.$emit('close');
            }
        },
        mounted() {
            setTimeout(() => {
                this.taskForm.title = this.currentTask.title;
                this.taskForm.summary = this.currentTask.summary;
                this.taskForm.description = this.currentTask.description;
                this.taskForm.startTime = this.currentTask.startTime;
                this.taskForm.endTime = this.currentTask.endTime;
                this.taskForm.executor = this.currentTask.executor;
                this.taskForm.priority = this.currentTask.priority;
                this.taskForm.status = this.currentTask.status;
                console.log(this.currentTask.id)
            }, 500);
            axios.get(`http://localhost:8080/users/findAllStaffDisplayNameByDepartmentOfCurrentLoggedManager`,
                {
                    headers: {
                        'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJraGFuaG5wQGdtYWlsLmNvbSIsImV4cCI6MTU1MTYxMTA5N30.uKQtiMqFMbG0NFaGkRmReHdKdj3OP8rK7J8KfUeDEGEqTu0JHop-ZBBir1067I57pV7eOzes8sY3w7pW6xe6Kg'
                    }
                }
            ).then(response => {
                this.executorOptions = response.data;
            });
        }
    }
</script>

<style scoped>

</style>