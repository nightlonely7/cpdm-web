<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
        <v-card-text>
            <p>
                <span style="width: 25%; float: left">Tên dự án</span>
                <span style="width: 75%; float: left"><b>{{project.name || 'Chưa xác định'}}</b></span>
            </p>
            <br>
            <v-divider></v-divider>
            <br>
            <p>
                <span style="width: 25%; float: left">Mã dự án</span>
                <span style="width: 75%; float: left"><b>{{project.alias || 'Chưa xác định'}}</b></span>
            </p>
        </v-card-text>
        <br/>
        <v-card>
            <v-card-title>Nội dung chi tiết</v-card-title>
            <v-divider></v-divider>
            <v-card-text v-html="project.description">
                <span v-if="!project.description">Chưa xác định</span>
            </v-card-text>
        </v-card>
        <br/>
        <v-list three-line class="elevation-1">
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
                    <v-list-tile-title>
                        Tên tác vụ: {{taskIssue.title}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>Tóm tắt: {{taskIssue.description}}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>
                        <span>Trạng thái :</span>
                        <v-chip :color="`${taskIssue.completed ? 'success' : ''}`">
                            {{taskIssue.completed ? 'Hoàn tất' : 'Chưa hoàn tất'}}
                        </v-chip>
                    </v-list-tile-sub-title>
                </v-list-tile-content>
                &nbsp; &nbsp; &nbsp;
                <v-list-tile-action-text>
                    <v-btn @click="viewTask(taskIssue.id)" color="primary">Xem chi tiết</v-btn>
                </v-list-tile-action-text>
            </v-list-tile>
            <v-list-tile v-if="taskIssues.length === 0">
                <v-list-tile-content>
                    <v-list-tile-title>
                        Không có tác vụ trong danh sách này!
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
            <v-subheader>
                <h4>Danh sách tài liệu</h4>
            </v-subheader>
            <v-divider></v-divider>
            <v-spacer></v-spacer>
            <v-list-tile
                    v-for="document in documents"
            >
                <v-list-tile-content>
                    <v-list-tile-title>
                        Tiêu đề: {{document.title}}
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                        Tóm tắt: {{document.summary}}
                    </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action-text>
                    <v-btn @click="viewDocument(document.id)" color="primary">Xem chi tiết</v-btn>
                </v-list-tile-action-text>
            </v-list-tile>
            <v-list-tile v-if="documents.length === 0">
                <v-list-tile-content>
                    <v-list-tile-title>
                        Không có tài liệu trong danh sách này!
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </v-list>
        <v-layout row>
            <ProjectForm :project-form="{...project}" @refresh="getProjectDetail(id)"
                         :project-name="project.name" :project-alias="project.alias">
                <template #activator="{on}">
                    <v-btn v-on="on" color="primary">Chỉnh Sửa</v-btn>
                </template>
            </ProjectForm>
            <v-btn @click="deleteProject" color="error">Xóa</v-btn>
        </v-layout>
        <br>
    </div>
</template>

<script>
    import axios from 'axios';
    import ProjectForm from "./ProjectForm";

    export default {
        name: "ProjectDetail",
        components: {ProjectForm},
        data() {
            return {
                project: {
                    id: 0,
                    name: '',
                    alias: '',
                    description: ''
                },
                taskIssues: [],
                documents: []
            }
        },
        props: {
            id: Number,

        },
        mounted() {
            this.getProjectDetail(this.id);
            this.getTaskIssueDetail(this.id);
            this.getDocumentDetail(this.id);
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
                    () => {
                        console.log("Wrong authentication!");
                    }
                );
            },
            getDocumentDetail: async function (id) {
                await axios.get(`http://localhost:8080/documents/search/all`, {
                    params: {
                        projectId: id
                    }
                })
                    .then(
                        response => {
                            this.documents = response.data;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            },
            goBack: function () {
                this.$router.push('/projects');
            },
            deleteProject: function () {
                if (confirm('Xóa dự án này?')) {
                    axios.delete(`http://localhost:8080/projects/${this.project.id}`)
                        .then(
                            () => {
                                this.$router.push("/projects");
                            }
                        ).catch(
                        err => {
                            console.log(err);
                        }
                    )
                }
            },
            viewTask: function (id) {
                this.$router.push(`/tasks/${id}`);
            },
            viewDocument: function (id) {
                this.$router.push(`/documents/${id}`);
            }
        },
    }
</script>

<style scoped>

</style>