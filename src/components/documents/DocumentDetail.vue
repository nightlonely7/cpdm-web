<template>
    <div>
        <v-btn @click="goBack" color="primary"><v-icon left>mdi-keyboard-backspace</v-icon>Trở về</v-btn>
        <br/><br/>
        <template v-if="isServerError">
            <v-card>
                <v-card-text>
                    <p>
                        <span style="width: 25%; float: left">Tên tài liệu</span>
                        <span style="width: 75%; float: left"><b>{{document.title || 'Chưa xác định'}}</b></span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Tóm tắt tài liệu</span>
                        <span style="width: 75%; float: left"><b>{{document.summary || 'Chưa xác định'}}</b></span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Mô tả</span>
                        <span style="width: 75%; float: left"><b><span v-html="document.description || 'Chưa xác định'"></span></b></span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Thời gian tạo</span>
                        <span style="width: 75%; float: left"><b>{{moment(document.createdTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</b></span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Thời gian hiệu lực</span>
                        <span style="width: 75%; float: left"><b>{{moment(document.startTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</b></span>
                    </p>
                    <br><v-divider></v-divider><br>
                    <p>
                        <span style="width: 25%; float: left">Thời gian hết hạn</span>
                        <span style="width: 75%; float: left"><b>{{moment(document.endTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</b></span>
                    </p>
                </v-card-text>
            </v-card>
            <p>Thời gian chỉnh sửa gần nhất:
                {{moment(document.lastModifiedTime,'DD-MM-YYYY HH:mm:ss' ).format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                <DocumentHistory :document="document" ref="documentHistory">
                    <template #activator="{ on }">
                        <v-btn v-on="on" color="primary">Xem lịch sử chỉnh sửa</v-btn>
                    </template>
                </DocumentHistory>
            </p>
            <DocumentForm :form="{...document}" @refresh="getDocumentDetail(id)" :document-title="`${document.title}`">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Sửa</v-btn>
                </template>
            </DocumentForm>
            <v-btn @click="deleteDocument" color="error">Xóa</v-btn>
        </template>
        <template v-else>
            <h3 style="color:red;">Không tìm thấy tài liệu cần tìm!</h3>
        </template>
        <DocumentFile :document="{...document}"></DocumentFile>
        <br>
    </div>
</template>

<script>
    import axios from 'axios';
    import 'vuex';
    import 'moment';
    import DocumentForm from "./DocumentForm";
    import DocumentFile from "./DocumentFile";
    import DocumentHistory from "./DocumentHistory";

    export default {
        name: "DocumentDetail",
        components: {DocumentHistory, DocumentFile, DocumentForm},
        data(){
            return {
                document: {
                    title: '',
                    project: {
                        id: 0,
                        name: ''
                    },
                    createdTime: '',
                    startTime: '',
                    endTime: '',
                    lastModifiedTime: '',
                },
                isServerError: true,
            }
        },
        computed: {

        },
        props: {
            id: Number
        },
        mounted() {
            this.getDocumentDetail(this.id);
        },
        methods: {
            getDocumentDetail: async function (id) {
                await axios.get(`http://localhost:8080/documents/${id}`)
                    .then(
                        response => {
                            this.document = response.data;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                            this.isServerError = false;
                        }
                    );
            },
            deleteDocument: function () {
                if (confirm('Xóa tài liệu này?')) {
                    axios.delete(`http://localhost:8080/documents/${this.document.id}`)
                        .then(
                            () => {
                                this.$router.push("/documents");
                            }
                        ).catch(
                            err => {
                                console.log(err);
                            }
                    )
                }
            },
            goBack: function () {
                this.$router.back();
            }
        },
    }
</script>

<style scoped>

</style>