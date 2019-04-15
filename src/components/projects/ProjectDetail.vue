<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
        <p style="color: blue">Tên dự án: {{project.name || 'Chưa xác định'}}</p>
        <p style="color: blue">Mã dự án: {{project.alias || 'Chưa xác định'}}</p>
        <v-list class="elevation-1">
            <v-subheader>
                <h4>Danh sách tác vụ</h4>
            </v-subheader>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-list-tile
                    v-for="taskIssue in taskIssues"
                    :key="taskIssue.id"
            >
                <v-list-tile-content>
                    <router-link :to="`/tasks/${taskIssue.id}`">
                        <v-list-tile-title v-text="taskIssue.title">
                        </v-list-tile-title>
                    </router-link>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
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
                project: {},
                taskIssues: []
            }
        },
        props: {
            id: Number
        },
        mounted() {
            this.getTaskIssueDetail(this.id);
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
            getTaskIssueDetail: async function (id) {
                console.log(typeof id);
                await axios.get(`http://localhost:8080/tasks/search/basicByExecutes`, {
                    params: {
                        projectId: id
                    }
                }).then(
                    response => {
                        this.taskIssues = response.data;
                        console.log(response.data);
                    }
                ).catch(
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
                this.$store.commit('PROJECT_STORE/SET_PROJECT_NAME', this.project.name);
                this.$store.commit('PROJECT_STORE/SET_IS_EDIT', true);
            },
            goBack: function () {
                this.$router.push('/projects');
            },
            showTaskDetail: function (id) {
                this.$router.push(`/tasks/${id}`);
            }
        },
    }
</script>

<style scoped>

</style>