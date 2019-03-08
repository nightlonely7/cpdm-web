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
                console.log(this.taskForm);

                const url = `http://localhost:8080/tasks/${this.taskForm.id === 0 ? '' : this.taskForm.id}`;
                const method = `${this.taskForm.id === 0 ? 'POST' : 'PUT'}`;
                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.taskForm
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

</style>