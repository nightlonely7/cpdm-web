<template>
    <div>
        <div class="text-xs-center" v-if="historyDetailLoading">
            <v-progress-circular indeterminate
                                 color="primary"
            ></v-progress-circular>
        </div>
        <div v-if="taskHistoryLoaded">
            <v-container>
                <h2>Tiêu đề : {{taskHistory.data.title || 'Chưa xác định'}}</h2>
                <v-divider></v-divider>
                <br>
                <h4>Nội dung tổng quát: </h4>
                <p>{{taskHistory.data.summary || 'Chưa xác định'}}</p>
                <br>
                <p>Thuộc dự án: {{taskHistory.data.project.name || 'Chưa xác định'}}</p>
                <br>
                <p v-if="(isAdmin || isManager) && isChild">Thuộc tác vụ tổng:
                    <router-link :to="`/tasks/${taskHistory.data.parentTask.id}`">
                        {{taskHistory.data.parentTask.title || 'Chưa xác định'}}
                    </router-link>
                </p>
                <br v-if="isChild">

                <p>Trạng thái:
                    <v-chip v-if="taskHistory.data.status === 'Waiting'">Đang chờ</v-chip>
                    <v-chip v-if="taskHistory.data.status === 'Working'" color="primary" text-color="white">Đang thực
                        hiện
                    </v-chip>
                    <v-chip v-if="taskHistory.data.status === 'Completed'" color="success" text-color="white">Hoàn
                        tất
                    </v-chip>
                    <v-chip v-if="taskHistory.data.status === 'Complete outdated'" color="error" text-color="white">
                        Hoàn tất quá hạn
                    </v-chip>
                    <v-chip v-if="taskHistory.data.status === 'Outdated'" color="error" text-color="white">Quá hạn
                    </v-chip>
                    <v-chip v-if="taskHistory.data.status === 'Near deadline'" color="warning" text-color="white">Gần
                        tới hạn
                    </v-chip>
                </p>
                <p>Độ ưu tiên: {{taskHistory.data.priority || 'Chưa xác định'}}</p>
                <p>Người tạo: {{taskHistory.data.creator.displayName || 'Chưa xác định'}}</p>
                <p>Người xử lý: {{taskHistory.data.executor.displayName || 'Chưa xác định'}}</p>
                <p>Thời gian tạo:
                {{moment(taskHistory.data.createdTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                </p>
                <p>Thời gian bắt đầu:
                {{moment(taskHistory.data.startTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                </p>
                <p>Thời gian kết thúc:
                {{moment(taskHistory.data.endTime,'DD-MM-YYYY HH:mm:ss' ).format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                </p>
                <p v-if="taskHistory.data.status === 'Completed' || taskHistory.data.status === 'Complete outdated'">Thời gian hoàn thành:
                {{moment(taskHistory.data.completedTime, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm') || 'Chưa xác định'}}
                </p>
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