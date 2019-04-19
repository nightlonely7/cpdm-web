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
        <ProjectForm :project-form="{...project}">
            <template #activator="{on}">
                <v-btn v-on="on" color="primary">Sửa</v-btn>
            </template>
        </ProjectForm>
        <v-btn @click="deleteProject" color="error">Xóa</v-btn>
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
            id: Number,

        },
        mounted() {
            this.getTaskIssueDetail(this.id);
            this.getProjectDetail(this.id);
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
            goBack: function () {
                this.$router.push('/projects');
            },
            deleteProject: function () {
                if (confirm('Xóa?')) {

                }
            }
        },
    }
</script>

<style scoped>

</style>