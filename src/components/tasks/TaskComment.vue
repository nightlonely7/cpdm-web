<template>
    <v-layout row>
        <v-flex xs12 sm12>
            <v-list>
                <v-toolbar color="indigo" dark>
                    <v-toolbar-title>Bình luận</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-subheader></v-subheader>
                <template v-for="(item,index) in this.comments">
                    <v-list-tile
                            :key="item.id + '_'"
                            avatar>
                        <v-list-tile-avatar>
                            <img v-if="item.avatar != null" :src="item.avatar">
                            <img v-else src="@/assets/default_avatar.png">
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title v-html="item.user.displayName"></v-list-tile-title>
                            <v-list-tile-action-text v-if="checkStatus(item.status)" @click="loadOldVersion(item.id)"
                                                     class="caption">
                                Đã chỉnh sửa
                            </v-list-tile-action-text>
                        </v-list-tile-content>

                        <v-btn v-if="item.user.displayName == displayName" outline fab small color="indigo"
                               v-show="!item.editDisable"
                               @click="editComment(item)"
                               :disabled="item.rulesDisable"
                               :onchange="checkEditInput(item.content,index)"
                        >
                            <v-icon>save</v-icon>
                        </v-btn>
                        <v-btn v-if="item.user.displayName == displayName" outline fab small color="indigo"
                               v-show="!item.editDisable"
                               @click="clearEdit()">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <!--<v-btn v-if="item.user.displayName == displayName" outline fab small color="red"-->
                        <!--v-show="item.editDisable"-->
                        <!--@click="deleteComment(item)">-->
                        <!--<v-icon>delete</v-icon>-->
                        <!--</v-btn>-->

                    </v-list-tile>

                    <v-textarea
                            :key="index"
                            v-model="item.content"
                            v-if="item.user.displayName == displayName"
                            auto-grow
                            rows="1"
                            single-line
                            :rules="[rules.required,rules.max]"
                            @click="showEditButton(index)"
                            :counter="!comments[index].editDisable"
                            maxlength="255"
                    >
                    </v-textarea>
                    <v-textarea
                            :key="index"
                            v-model="item.content"
                            v-if="item.user.displayName != displayName"
                            readonly
                            auto-grow
                            rows="1"
                            single-line
                    >
                    </v-textarea>
                </template>
                <v-icon
                        v-if="this.pageSize*(this.currentPage+1) < this.totalElements"
                        class="px-2 py-4"
                        @click="loadmore()">mdi-dots-horizontal
                </v-icon>
                <v-textarea
                        id="inputTextArea" ref="addInput"
                        v-model="newCommentModel.content"
                        label='Bình luận'
                        outline
                        :rules="[rules.required,rules.max]"
                        counter
                        maxlength="255"
                ></v-textarea>

                <v-card-actions>
                    <v-spacer/>
                    <v-btn outline fab small color="indigo" @click="addComment()"
                           :onchange="checkInput(newCommentModel.content)"
                           :disabled="this.disable">
                        <v-icon>add</v-icon>
                    </v-btn>
                    <v-btn outline fab small color="red" @click="clear()">
                        <v-icon>close</v-icon>
                    </v-btn>
                </v-card-actions>

            </v-list>
        </v-flex>

        <!--Snack bar-->
        <v-snackbar v-model="snackbar" right>
            {{snackBarText}}
            <v-btn
                    color="pink"
                    flat
                    @click="snackbar = false"
            >
                Close
            </v-btn>
        </v-snackbar>

        <!--View old comment version dialog model-->
        <v-dialog class="v-dialog--scrollable" v-model="this.oldVersions" v-if="this.showDialog">
            <v-list>
                <v-subheader class="display-1">Bình luận cũ</v-subheader>
                <template v-for="(item, index) in this.oldVersions">
                    <v-list-tile-content :key="item.id">
                        <v-list-tile-title v-html="item.createdDate"></v-list-tile-title>
                    </v-list-tile-content>

                    <v-textarea
                            :key="index"
                            v-model="item.content"
                            readonly
                            auto-grow
                            rows="1"
                            single-line
                    >
                    </v-textarea>
                </template>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn color="primary" @click="closedialog()">Close</v-btn>
                </v-card-actions>
            </v-list>
        </v-dialog>
    </v-layout>
</template>

<script>
    import {mapState} from 'vuex'
    import axios from 'axios';
    import {pushNotif} from "@/firebase.js";

    export default {
        name: "TaskComment",
        default_avatar: '@/assets/default_avatar.png',
        props: {
            taskId: Number
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                displayName: state => state.displayName
            }),
            ...mapState('TASK_STORE', {
                task: state => state.task
            })
        },
        data() {
            return {
                showDialog: false,
                disable: true,
                snackbar: false,
                snackBarText: '',
                comments: {},
                newCommentModel: {
                    content: '',
                    task: {
                        id: '',
                    },
                    status: 0
                },
                replies: {},
                oldVersions: [],
                currentPage: 0,
                pageSize: 5,
                totalElements: '',
                rules: {
                    required: v => !!v || 'Nội dung không được bỏ trống',
                    max: v => (!!v && v.length <= 255) || 'Nội dung tối đa 255 kí tự'
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.getComment();
            })
        },
        methods: {
            getComment: function () {
                const params = {
                    id: this.taskId,
                    page: 0,
                    size: this.pageSize * (this.currentPage + 1),
                    sort: 'createdDate,desc'
                };
                axios.get(`http://localhost:8080/comments/findByTask`, {params})
                    .then(response => {
                            // this.$store.commit('COMMENT_STORE/SET_COMMENT', response.data.content);
                            this.comments = response.data.content;
                            for (var i in this.comments) {
                                this.$set(this.comments[i], 'editDisable', true);
                                this.$set(this.comments[i], 'rulesDisable', true);
                            }
                            this.totalElements = response.data.totalElements;
                        }
                    )
            }
            , loadmore: function () {
                this.currentPage++;
                this.getComment();
            },
            addComment() {
                this.newCommentModel.task.id = this.taskId;

                var url = `http://localhost:8080/comments/`;
                var method = 'POST';

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.newCommentModel
                    }
                ).then(() => {
                        axios.get(`http://localhost:8080/tasks/${this.taskId}`).then((response) => {
                            var title = 'Bình luận mới từ' + this.displayName;
                            var detail = this.newCommentModel.content;
                            var url = '/tasks/' + this.taskId;
                            var users = [];
                            if(this.displayName === response.data.executor.displayName){
                                users.push(response.data.creator);
                            }
                            else {
                                users.push(response.data.executor);
                            }
                            pushNotif(title, detail, url, users);
                            this.clear();
                            this.getComment();
                            this.snackBarText = 'Thành công';
                            this.snackbar = true;
                        }).catch((error) => {
                            console.log(error);
                            this.clear();
                            this.getComment();
                            this.snackBarText = 'Thành công';
                            this.snackbar = true;
                        });
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                        this.snackBarText = 'Thất bại';
                        this.snackbar = true;
                    }
                );
            },
            updateComment(model, status) {
                var updateModel = model;
                updateModel.status = status;

                var url = `http://localhost:8080/comments/` + updateModel.id;
                var method = 'PUT';

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: updateModel
                    }
                ).then(() => {
                        this.getComment();
                        this.snackBarText = 'Thành công';
                        this.snackbar = true;

                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                        this.snackBarText = 'Thất bại';
                        this.snackbar = true;
                    }
                );
            },
            editComment(model) {
                this.updateComment(model, 1);
            },
            clear() {
                this.$refs.addInput.reset();
                // this.newCommentModel.content = '';
            },
            clearEdit() {
                this.getComment();
            }
            ,
            deleteComment(model) {
                if (confirm('Xóa?')) {
                    this.updateComment(model, 2);
                }
            },
            loadReply(id) {
                var url = `http://localhost:8080/comments/loadReply/` + id;
                var method = 'GET';

                axios.request(
                    {
                        url: url,
                        method: method
                    }
                ).then(response => {
                        this.replies = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            }
            , loadOldVersion(id) {
                var url = `http://localhost:8080/comments/loadOldVersion/` + id;
                var method = 'GET';

                axios.request(
                    {
                        url: url,
                        method: method
                    }
                ).then(response => {
                        this.showDialog = true;
                        this.oldVersions = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            closeDialog() {
                this.showDialog = false;
            },
            checkInput(input) {
                if (!!input && input.length <= 255) {
                    this.disable = false;
                } else {
                    this.disable = true;
                }
            },
            checkEditInput(input, index) {
                if (!!input && input.length <= 255) {
                    this.comments[index].rulesDisable = false;
                } else {
                    this.comments[index].rulesDisable = true;
                }
            },
            showEditButton(index) {
                this.comments[index].editDisable = false;
            },
            checkStatus(status) {
                if (status == 1) {
                    return true;
                }
            }
        }
    }
</script>

<style scoped>

</style>