<template>
    <div>
        <div class="text-xs-center" v-if="historyDetailLoading">
            <v-progress-circular indeterminate
                                 color="primary"
            ></v-progress-circular>
        </div>
        <div v-if="documentHistoryLoaded">
            <v-container>
                <v-card-text>
                    <p>
                        <span style="width: 25%; float: left"><b>Tên tài liệu</b></span>
                        <span style="width: 75%; float: left"><b>{{documentHistory.data.title || 'Chưa xác định'}}</b></span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Tóm tắt tài liệu</span>
                        <span style="width: 75%; float: left">{{documentHistory.data.summary || 'Chưa xác định'}}</span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Thời gian tạo</span>
                        <span style="width: 75%; float: left">{{moment(documentHistory.data.createdTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Thời gian hiệu lực</span>
                        <span style="width: 75%; float: left">{{moment(documentHistory.data.startTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Thời gian hết hạn</span>
                        <span style="width: 75%; float: left">{{moment(documentHistory.data.endTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</span>
                    </p>
                </v-card-text>
                <br/>
                <v-card>
                    <v-card-title>Nội dung chi tiết</v-card-title>
                    <v-divider></v-divider>
                    <v-card-text v-html="documentHistory.data.description">
                        <span v-if="!documentHistory.data.description">Chưa xác định</span>
                    </v-card-text>
                </v-card>
                <br/>
            </v-container>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "DocumentHistoryDetail",
        data(){
            return {
                documentHistory: {},
                historyDetailLoading: false,
                documentHistoryLoaded: false,
            }
        },
        props: {
            id: Number,
            activate: Boolean
        },
        methods: {
            getDocumentHistoryDetail(){
                this.historyDetailLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/documents/histories/${this.id}`)
                        .then(response => {
                            this.documentHistory = response.data;
                            this.documentHistoryLoaded = true;
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
                if (val) {
                    if (!this.documentHistoryLoaded) {
                        console.log(this.documentHistory);
                        this.getDocumentHistoryDetail();
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>