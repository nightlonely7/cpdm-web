<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
        <p style="color: blue">Tên phòng ban: {{project.name || 'Chưa xác định'}}</p>
        <p style="color: blue">Mã phòng ban: {{project.alias || 'Chưa xác định'}}</p>
        <v-btn @click="showForm" color="primary">Sửa</v-btn>
        <ProjectForm></ProjectForm>
        <br>
    </div>
</template>

<script>
    import axios from 'axios';
    import ProjectForm from "./ProjectForm";

    export default {
        name: "ProjectDetail",
        components: {ProjectForm},
        data(){
            return {
                project: {}
            }
        },
        props: {
            id: Number
        },
        mounted() {
            this.getProjectDetail(this.id);
            this.$store.commit('PROJECT_STORE/SET_SHOW_FORM', false);
        },
        methods: {
            getProjectDetail: async function (id) {
                await axios.get(`http://localhost:8080/projects/${id}`)
                    .then(
                        response => {
                            this.project = response.data;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            },
            showForm: function () {
                this.$store.commit('PROJECT_STORE/SET_SHOW_FORM', true);
                this.$store.commit('PROJECT_STORE/SET_PROJECT_FORM', this.project);
                const project = {...this.project};
                this.$store.commit('PROJECT_STORE/SET_CURRENT_PROJECT', project);
                this.$store.commit('PROJECT_STORE/SET_IS_EDIT', true);
            },
            goBack: function () {
                this.$router.push('/projects');
            }
        },
    }
</script>

<style scoped>

</style>