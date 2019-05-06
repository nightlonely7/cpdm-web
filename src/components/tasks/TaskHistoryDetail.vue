<template>
    <div>
        <div class="text-xs-center" v-if="historyDetailLoading">
            <v-progress-circular indeterminate
                                 color="primary"
            ></v-progress-circular>
        </div>
        <div v-if="taskHistoryLoaded">
            <v-container>

                <p>
                    <span style="width: 25%; float: left"><b>Tiêu đề</b></span>
                    <span style="width: 75%; float: left"><b>{{taskHistory.data.title || 'Chưa xác định'}}</b></span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p>
                    <span style="width: 25%; float: left">Nội dung tổng quát</span>
                    <span style="width: 75%; float: left">{{taskHistory.data.summary || 'Chưa xác định'}}</span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p>
                    <span style="width: 25%; float: left">Thuộc dự án</span>
                    <span style="width: 75%; float: left">{{taskHistory.data.project.name || 'Chưa xác định'}}</span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p v-if="(isAdmin || isManager) && isChild">
                    <span style="width: 25%; float: left">Thuộc tác vụ tổng</span>
                    <router-link :to="`/tasks/${taskHistory.data.parentTask.id}`">
                        <span style="width: 75%; float: left">
                        {{taskHistory.data.parentTask.title || 'Chưa xác định'}}
                    </span>
                    </router-link>
                </p>

                <br v-if="isChild">
                <v-divider v-if="isChild"></v-divider>
                <br v-if="isChild">

                <p>
                    <span style="width: 25%; float: left">Độ ưu tiên</span>
                    <span style="width: 75%; float: left">{{taskHistory.data.priority || 'Chưa xác định'}}</span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p>
                    <span style="width: 25%; float: left">Người tạo</span>
                    <span style="width: 75%; float: left">{{taskHistory.data.creator.displayName || 'Chưa xác định'}}
                    </span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p>
                    <span style="width: 25%; float: left">Người xử lý</span>
                    <span style="width: 75%; float: left">{{taskHistory.data.executor.displayName || 'Chưa xác định'}}
                    </span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p>
                    <span style="width: 25%; float: left">Thời gian tạo</span>
                    <span style="width: 75%; float: left">
                        {{moment(taskHistory.data.createdTime, 'DD-MM-YYYY HH:mm:ss')
                            .format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                    </span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p>
                    <span style="width: 25%; float: left">Thời gian bắt đầu</span>
                    <span style="width: 75%; float: left">
                        {{moment(taskHistory.data.startTime, 'DD-MM-YYYY HH:mm:ss')
                            .format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                    </span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p>
                    <span style="width: 25%; float: left">Thời gian kết thúc</span>
                    <span style="width: 75%; float: left">
                        {{moment(taskHistory.data.endTime,'DD-MM-YYYY HH:mm:ss' )
                            .format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                    </span>
                </p>

                <br>
                <v-divider></v-divider>
                <br>

                <p v-if="taskHistory.data.status === 'Completed' || taskHistory.data.status === 'Complete outdated'">
                    <span style="width: 25%; float: left">Thời gian hoàn thành</span>
                    <span style="width: 75%; float: left">
                        {{moment(taskHistory.data.completedTime, 'DD-MM-YYYY HH:mm:ss')
                            .format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                    </span>
                </p>

                <br v-if="taskHistory.data.status === 'Completed' || taskHistory.data.status === 'Complete outdated'">
                <v-divider v-if="taskHistory.data.status === 'Completed' || taskHistory.data.status === 'Complete outdated'"></v-divider>
                <br v-if="taskHistory.data.status === 'Completed' || taskHistory.data.status === 'Complete outdated'">

                <v-card>
                    <v-card-title>Nội dung chi tiết</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text v-html="taskHistory.data.description">
                        <span v-if="!taskHistory.data.description">Chưa xác định</span>
                    </v-card-text>
                </v-card>

            </v-container>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from "vuex";

    export default {
        name: "TaskHistoryDetail",
        data() {
            return {
                taskHistory: {},
                historyDetailLoading: false,
                taskHistoryLoaded: false,
            }
        },
        props: {
            id: Number,
            activate: Boolean,
        },
        computed: {
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            }),
            isChild: function () {
                return !!this.taskHistory.data.parentTask;
            },
        },
        methods: {
            getTaskHistoryDetail() {
                this.historyDetailLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/tasks/histories/${this.id}`)
                        .then(response => {
                            this.taskHistory = response.data;
                            this.taskHistoryLoaded = true;
                        })
                        .catch(error => {
                            if (error.response) {
                                console.log(error.response.data);
                            } else {
                                console.log(error.response);
                            }
                        })
                        .finally(() => {
                            this.historyDetailLoading = false;
                        })
                }, 500);
            }
        },
        watch: {
            activate(val) {
                console.log(this.taskHistory);
                if (val) {
                    if (!this.taskHistoryLoaded) {
                        this.getTaskHistoryDetail();
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>