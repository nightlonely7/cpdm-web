<template>
    <div>
        <v-btn @click="goBack" color="primary">
            <v-icon left>mdi-keyboard-backspace</v-icon>
            Trở về
        </v-btn>
        <br/><br/>
        <template v-if="loaded">
            <v-card-text>
                <p>
                    <span style="width: 25%; float: left">Tên tài liệu</span>
                    <span style="width: 75%; float: left"><b>{{document.title || 'Chưa xác định'}}</b></span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Tóm tắt tài liệu</span>
                    <span style="width: 75%; float: left"><b>{{document.summary || 'Chưa xác định'}}</b></span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Thời gian tạo</span>
                    <span style="width: 75%; float: left"><b>{{moment(document.createdTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</b></span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Thời gian hiệu lực</span>
                    <span style="width: 75%; float: left"><b>{{moment(document.startTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</b></span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Thời gian hết hạn</span>
                    <span style="width: 75%; float: left"><b>{{moment(document.endTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</b></span>
                </p>
            </v-card-text>
            <br/>
            <v-card>
                <v-card-title>Nội dung chi tiết</v-card-title>
                <v-divider></v-divider>
                <v-card-text v-html="document.description">
                    <span v-if="!document.description">Chưa xác định</span>
                </v-card-text>
            </v-card>
            <br/>
            <p>Thời gian chỉnh sửa gần nhất:
                {{moment(document.lastModifiedTime,'DD-MM-YYYY HH:mm:ss' )
                .format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                <DocumentHistory :document="document" ref="documentHistory">
                    <template #activator="{ on }">
                        <v-btn v-on="on" color="primary">Xem lịch sử chỉnh sửa</v-btn>
                    </template>
                </DocumentHistory>
            </p>
            <v-layout row>
                <DocumentForm :form="{...form}" @refresh="getDocumentDetail(id)" :document-title="`${document.title}`">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">Chỉnh Sửa</v-btn>
                    </template>
                </DocumentForm>
                <v-btn @click="deleteDocument" color="error">Xóa</v-btn>
            </v-layout>
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
    import DocumentForm from "./DocumentForm";
    import DocumentFile from "./DocumentFile";
    import DocumentHistory from "./DocumentHistory";
    import moment from 'moment';

    export default {
        name: "DocumentDetail",
        components: {DocumentHistory, DocumentFile, DocumentForm},
        data() {
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
                loaded: false,
            }
        },
        computed: {
            form: function () {
                return {
                    ...this.document,
                    startDate: moment(this.document.startTime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'),
                    startTime: moment(this.document.startTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm'),
                    endDate: moment(this.document.endTime, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'),
                    endTime: moment(this.document.endTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm'),
                };
            },
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
                            this.loaded = true;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
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