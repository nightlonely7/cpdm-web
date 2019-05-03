<template>
    <v-dialog v-model="taskHistoryDialog" fullscreen transition="dialog-bottom-transition">
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click="taskHistoryDialog = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Bản lưu của tác vụ '{{task.title}}'</v-toolbar-title>
            </v-toolbar>
            <v-progress-linear v-if="historiesLoading" indeterminate></v-progress-linear>
            <v-card-text>
                <v-expansion-panel v-model="taskHistoryExpansionPanel">
                    <v-expansion-panel-content v-for="(taskHistory, index) in taskHistories" :key="taskHistory.id">
                        <template #header>
                            Bản lưu lúc {{moment(taskHistory.createdTime).format('DD/MM/YYYY HH:mm:ss')}}
                            bởi {{taskHistory.creator.displayName}}
                        </template>
                        <TaskHistoryDetail :activate="taskHistoryExpansionPanel === index"
                                           :id="taskHistory.id"></TaskHistoryDetail>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
    import axios from 'axios';
    import TaskHistoryDetail from "./TaskHistoryDetail";

    export default {
        name: "TaskHistory",
        components: {TaskHistoryDetail},
        data() {
            return {
                taskHistoryExpansionPanel: [],
                taskHistoryDialog: false,
                historiesLoading: false,
                historiesLoaded: false,
                taskHistories: [],
            }
        },
        props: {
            task: Object,
        },
        methods: {
            getTaskHistories() {
                this.historiesLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/tasks/${this.task.id}/histories`)
                        .then(response => {
                            this.taskHistories = response.data;
                            this.historiesLoaded = true;
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                        .finally(() => {
                            this.historiesLoading = false;
                        })
                }, 500);

            },

        },
        watch: {
            taskHistoryDialog(val) {
                if (val) {
                    if (!this.historiesLoaded) {
                        this.getTaskHistories();
                    }
                }
            },
            task() {
                this.historiesLoaded = false;
            },
        }
    }
</script>

<style scoped>

</style>