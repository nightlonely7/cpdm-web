<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
        <template v-if="isServerError">
            <p style="color: blue">Tên tài liệu: {{document.title || 'Chưa xác định'}}</p>
            <p style="color: blue">Tóm tắt tài liệu: {{document.summary || 'Chưa xác định'}}</p>
            <span v-html="document.description"></span>
            <p style="color: blue">Tên dự án: {{document.project.name || 'Chưa xác định'}}</p>
            <p style="color: blue">Thời gian tạo: {{moment(document.createdTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</p>
            <p style="color: blue">Thời gian hiệu lực: {{moment(document.startTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</p>
            <p style="color: blue">Thời gian hết hạn: {{moment(document.endTime).format('DD-MM-YYYY HH:mm:ss') || 'Chưa xác định'}}</p>
            <DocumentForm :document-form="{...document}">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Sửa</v-btn>
                </template>
            </DocumentForm>
            <v-btn @click="deleteDocument" color="error">Xóa</v-btn>
        </template>
        <template v-else>
            <h3 style="color:red;">Không tìm thấy tài liệu cần tìm!</h3>
        </template>
        <br>
    </div>
</template>

<script>
    import axios from 'axios';
    import 'vuex';
    import 'moment';
    import DocumentForm from "./DocumentForm";

    export default {
        name: "DocumentDetail",
        components: {DocumentForm},
        data(){
            return {
                document: {
                    project: {
                        id: 0,
                        name: ''
                    },
                    createdTime: '',
                    startTime: '',
                    endTime: '',
                },
                isServerError: true
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
                    const document = {...this.document};
                    document.isAvailable = false;
                    axios.patch(`http://localhost:8080/documents/${document.id}`, {})
                        .then(
                            response => {
                                this.document = response.data;
                                console.log(this.document);
                                this.$store.commit('DOCUMENT_STORE/SET_IS_EDIT', false);
                                this.$store.commit('DOCUMENT_STORE/SET_DOCUMENT_NAME', '');
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
                this.$router.push('/documents');
            }
        },
    }
</script>

<style scoped>

</style>