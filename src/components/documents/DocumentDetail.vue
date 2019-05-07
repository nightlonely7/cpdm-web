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
                    <span style="width: 25%; float: left"><b>Tên tài liệu</b></span>
                    <span style="width: 75%; float: left"><b>{{document.title || 'Chưa xác định'}}</b></span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Tóm tắt tài liệu</span>
                    <span style="width: 75%; float: left">{{document.summary || 'Chưa xác định'}}</span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Thời gian tạo</span>
                    <span style="width: 75%; float: left">{{moment(document.createdTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Thời gian hiệu lực</span>
                    <span style="width: 75%; float: left">{{moment(document.startTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Thời gian hết hạn</span>
                    <span style="width: 75%; float: left">{{moment(document.endTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</span>
                </p>
                <br>
                <v-divider></v-divider>
                <br>
                <p>
                    <span style="width: 25%; float: left">Thời gian chỉnh sửa gần nhất</span>
                    <span style="width: 75%; float: left; position: relative; bottom: 15px">
                        <b>{{moment(document.lastModifiedTime,'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm:ss') || 'Chưa xác định'}}
                        <DocumentHistory :document="document" ref="documentHistory">
                            <template #activator="{ on }">
                                <v-btn v-on="on" color="primary">Xem lịch sử chỉnh sửa</v-btn>
                            </template>
                        </DocumentHistory>
                        </b>
                    </span>
                </p>
                <br>
                <v-divider></v-divider>
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

            <v-layout row>
                <DocumentForm :form="{...form}" @refresh="getDocumentDetail(id)" :document-title="`${document.title}`">
                    <template #activator="{on}">
                        <v-btn v-on="on" color="primary">Chỉnh Sửa</v-btn>
                    </template>
                </DocumentForm>
                <v-btn @click="deleteDocument" color="error">Xóa</v-btn>
            </v-layout>
            <DocumentFile :document="{...document}"></DocumentFile>
        </template>
        <template v-if="isServerError">
            <h3 style="color:red;">Không tìm thấy tài liệu cần tìm!</h3>
        </template>
        <br>


        <v-expansion-panel>
            <v-expansion-panel-content>
                <template #header>
                    <span><v-icon left>mdi-file-document</v-icon>Danh sách tác vụ liên quan</span>
                </template>
                <div class="text-xs-center" v-if="!tasks || (!!tasks && !tasks.length)">
                    <span>Không có tác vụ nào</span>
                </div>
                <v-list three-line>
                    <v-list-tile v-for="task in tasks" :key="task.id">
                        <v-list-tile-content>
                            <v-list-tile-title>Tiêu đề: {{ task.title }}</v-list-tile-title>
                            <v-list-tile-sub-title>Tổng quát: {{ task.summary }}</v-list-tile-sub-title>
                            <v-list-tile-sub-title>
                                <router-link :to="`/tasks/${task.id}`">Đường dẫn tới tác vụ</router-link>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-expansion-panel-content>
        </v-expansion-panel>
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
                tasks: [],
                loaded: false,
                isServerError: false
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
                            this.getTaskDocuments();
                            this.loaded = true;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                            this.isServerError = true;
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
            getTaskDocuments: function () {
                axios.get(`http://localhost:8080/documents/${this.id}/tasks`)
                    .then(response => {
                        this.tasks = response.data;
                    })
            },
            goBack: function () {
                this.$router.back();
            }
        },
    }
</script>

<style scoped>

</style>