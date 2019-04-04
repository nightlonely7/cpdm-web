<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
        <p style="color: blue">Tên tài liệu: {{document.title || 'Chưa xác định'}}</p>
        <p style="color: blue">Tóm tắt tài liệu: {{document.summary || 'Chưa xác định'}}</p>
        <p style="color: blue">Mô tả tài liệu: {{document.description || 'Chưa xác định'}}</p>
        <p style="color: blue">Tên dự án: {{projectName || 'Chưa xác định'}}</p>
        <p style="color: blue">Thời gian tạo: {{createdTime || 'Chưa xác định'}}</p>
        <p style="color: blue">Thời gian hiệu lực: {{startedTime || 'Chưa xác định'}}</p>
        <p style="color: blue">Thời gian hết hạn: {{endTime || 'Chưa xác định'}}</p>
        <v-list>

        </v-list>
        <v-btn @click="showForm" color="primary">Sửa</v-btn>
        <v-btn @click="deleteDocument" color="error">Xóa</v-btn>
        <br>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from 'vuex';

    export default {
        name: "DocumentDetail",
        data(){
            return {
                document: {},
                projectName: '',
                createdTime: '',
                startedTime: '',
                endTime: ''
            }
        },
        computed: {

        },
        props: {
            id: Number
        },
        mounted() {
            this.getDocumentDetail(this.id);
            this.$store.commit('DOCUMENT_STORE/SET_SHOW_FORM', false);
        },
        methods: {
            getDocumentDetail: async function (id) {
                await axios.get(`http://localhost:8080/documents/${id}`)
                    .then(
                        response => {
                            this.document = response.data;
                            this.projectName = response.data.project.name;
                            this.createdTime = response.data.createdTime.split('T')[0];
                            this.startedTime = response.data.startTime.split('T')[0];
                            this.endTime = response.data.endTime.split('T')[0];
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            },
            showForm: function () {
                this.$store.commit('DOCUMENT_STORE/SET_SHOW_FORM', true);
                this.$store.commit('DOCUMENT_STORE/SET_DOCUMENT_FORM', this.document);
                this.$store.commit('DOCUMENT_STORE/SET_DOCUMENT_NAME', this.document.title);
                const document = {...this.document};
                this.$store.commit('DOCUMENT_STORE/SET_CURRENT_DOCUMENT', document);
                this.$store.commit('DOCUMENT_STORE/SET_IS_EDIT', true);
            },
            deleteDocument: function () {
                if (confirm('Xóa?')) {
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