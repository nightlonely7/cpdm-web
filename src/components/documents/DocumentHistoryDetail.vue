<template>
    <div>
        <div class="text-xs-center" v-if="historyDetailLoading">
            <v-progress-circular indeterminate
                                 color="primary"
            ></v-progress-circular>
        </div>
        <div v-if="documentHistoryLoaded">
            <v-container>
                <p style="color: blue">Tên tài liệu: {{documentHistory.data.title || 'Chưa xác định'}}</p>
                <p style="color: blue">Tóm tắt tài liệu: {{documentHistory.data.summary || 'Chưa xác định'}}</p>
                <p style="color: blue">Mô tả:</p>
                <span v-html="documentHistory.data.description" style="color: blue"></span>
                <p style="color: blue">Thời gian tạo: {{moment(documentHistory.data.createdTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</p>
                <p style="color: blue">Thời gian hiệu lực: {{moment(documentHistory.data.startTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</p>
                <p style="color: blue">Thời gian hết hạn: {{moment(documentHistory.data.endTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</p>
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