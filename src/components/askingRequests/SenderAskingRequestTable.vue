<template>
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" v-if="this.status===0" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">XIN Ý KIẾN LÃNH ĐẠO</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-textarea
                                            ref="txtContent"
                                            v-model="editItem.content"
                                            label="Nội dung"
                                            :rules="[rules.required,rules.max]"
                                            counter
                                            maxlength="255"
                                            readonly
                                    ></v-textarea>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="displayName"
                                            label="Người yêu cầu"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="editItem.receiver.displayName"
                                            label="Người trả lời"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-select
                                            v-model="editItem.tasks"
                                            :items="tasks"
                                            item-text="title"
                                            name="task"
                                            label="Tác vụ"
                                            return-object
                                            multiple
                                            chips
                                            readonly
                                    ></v-select>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">ĐÓNG</v-btn>
                        <v-btn color="blue darken-1" flat @click="save">LƯU</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-data-table
                :headers="table.headers"
                :items="userAskingRequests"
                :loading="table.loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                rows-per-page-text="Số hàng mỗi trang"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                must-sort
        >
            <v-progress-linear #progress color="blue" indeterminate></v-progress-linear>
            <template #items="props">
                <td class="text-xs-left">{{props.item.createdDate}}</td>
                <td class="text-xs-left">{{props.item.receiver.displayName}}</td>
                <td class="text-xs-left">{{props.item.content}}</td>
                <td class="text-xs-left" v-if="props.item.status === 1">{{props.item.response}}</td>
                <td class="text-xs-left">
                    <template v-for="task in props.item.tasks">
                        <router-link :key="task.id"
                                     :to="`/tasks/${task.id}`"
                                     class="text-xs-left"
                                     onmouseover="this.style.cursor='pointer'"
                                     onmouseout="this.style.cursor='none'">
                            {{task.title}}
                        </router-link>
                        <br/>
                    </template>
                </td>
                <td class="text-xs-left" v-if="props.item.status === 0">
                    <v-card-actions>
                        <!--<v-btn outline fab small color="indigo" @click="editAskingRequest(props.item)">-->
                        <!--<v-icon>edit</v-icon>-->
                        <!--</v-btn>-->
                        <v-btn outline fab small color="red" @click="deleteAskingRequest(props.item.id)">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </v-card-actions>
                </td>
            </template>
        </v-data-table>

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
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters, mapState} from "vuex";
    import {pushNotif} from "@/firebase.js";

    export default {
        name: "SenderAskingRequestTable",
        props: {
            type: String,
            refreshFlag: Boolean,
        },
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                title: '',
                status: 0,
                dialog: false,
                rules: {
                    required: v => !!v || 'Nội dung không được để trống',
                    max: v => (!!v && v.length <= 255) || 'Nội dung tối đa 255 kí tự'
                },
                defaultItem: {
                    id: 0,
                    content: '',
                    response: '',
                    user: {},
                    receiver: {},
                    tasks: [],
                    status: 0
                },
                editItem: {
                    id: 0,
                    content: '',
                    response: '',
                    user: {},
                    receiver: {},
                    tasks: [],
                    status: 0
                },
                userAskingRequests: [],
                receivers: [],
                tasks: [],
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'createdDate',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Người nhận', value: 'receiver.displayName'},
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Tác vụ liên quan', value: 'tasks'},
                    ]
                },
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                role: state => state.role,
                displayName: state => state.displayName,
            }),
            ...mapGetters('AUTHENTICATION', {
                isInit: 'isInit',
                isLoggedIn: 'isLoggedIn',
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            }),
        },
        mounted() {
            this.$nextTick(function () {
                switch (this.type) {
                    case 'waiting':
                        this.title = 'YÊU CẦU ĐANG CHỜ';
                        this.status = 0;
                        this.table.headers.push({text: 'Thao tác', value: 'status'});
                        break;
                    case 'replied':
                        this.title = 'YÊU CẦU ĐÃ PHẢN HỒI';
                        this.status = 1;
                        this.table.headers.pop();
                        this.table.headers.push({text: 'Phản hồi', value: 'response'});
                        this.table.headers.push({text: 'Tác vụ liên quan', value: 'task'});
                        break;
                }
                this.refresh();
                this.getReceivers();
            })
        },
        methods: {
            getReceivers: function () {
                var roleName = "ROLE_MANAGER";
                if (!this.isStaff) {
                    roleName = "ROLE_ADMIN";
                }
                axios.get(`http://localhost:8080/users/findAllDisplayNameByDepartmentAndRoleNameOfCurrentLoggedManager`,
                    {
                        params: {
                            roleName: roleName
                        }
                    }
                ).then(response => {
                        this.receivers = response.data;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            setDialog: function () {
                //Set receiver
                this.editItem.receiver = this.receivers[0];

                //Reset content
                this.$refs.txtContent.reset();
            },
            getUserAskingRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/askingRequests/search/findByUser`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            status: this.status
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.userAskingRequests = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.userAskingRequests = response.data.content;
                            this.pagination.totalItems = response.data.totalElements;
                        }
                        this.table.loading = false;
                    }
                ).catch(error => {
                        this.table.loading = false;
                        this.alert = 'Không thể truy cập';
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    }
                );
            },
            refresh() {
                this.getUserAskingRequests();
            },
            deleteAskingRequest(id) {
                if (confirm('Bạn muốn xóa đơn này?')) {
                    axios.delete(`http://localhost:8080/askingRequests/` + id)
                        .then(() => {
                                //create and send notification
                                var title = "Một yêu cầu chỉ đạo đã xóa bởi " + this.displayName;
                                var detail = '';
                                var url = "/receiverAskingRequests";
                                var users = [];
                                users.push(this.receivers[0]);
                                pushNotif(title, detail, url, users);
                                //refresh and dialog
                                this.refresh();
                                this.snackbar = true;
                                this.snackBarText = "Thành công";
                            }
                        ).catch(error => {
                            if (error.response) {
                                console.log(error.response.data)
                            }
                            if (error.response.status === 405) {
                                this.snackbar = true;
                                this.snackBarText = "Không thể xóa yêu cầu đã được phản hồi";
                            } else {
                                this.snackbar = true;
                                this.snackBarText = "Thất bại";
                            }

                        }
                    );
                }
            },
            editAskingRequest(item) {
                Object.assign(this.editItem, item);
                this.dialog = true;
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editItem = Object.assign({}, this.defaultItem)
                }, 300)
            },
            save() {
                //check input condition
                if (this.editItem.content == null || this.editItem.content.trim() == '') {
                    this.snackBarText = 'Nội dung không được để trống';
                    this.snackbar = true;
                    return;
                } else if (this.editItem.content.length > 255) {
                    this.snackBarText = 'Nội dung không được quá 255 kí tự';
                    this.snackbar = true;
                    return;
                }

                //call api
                var url = `http://localhost:8080/askingRequests`;
                var method = 'POST';

                if (this.editItem.id != 0) {
                    url = `http://localhost:8080/askingRequests/` + this.editItem.id;
                    method = 'PUT';
                }

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.editItem
                    }
                ).then(() => {
                        this.pushnotification(this.editItem);
                        this.close();
                        this.refresh();
                        this.snackBarText = 'Thành công';
                        this.snackbar = true;
                    }
                ).catch(error => {
                        if (error.response) {
                            console.log(error.response.data)
                        }
                        if (error.response.status == 405) {
                            this.snackBarText = 'Không thể chỉnh sửa yêu cầu đã được phản hồi';
                            this.snackbar = true;
                        } else {
                            this.snackBarText = 'Thất bại';
                            this.snackbar = true;
                        }
                    }
                );
            },
            pushnotification(item) {
                var title = "Yêu cầu chỉ đạo mới từ " + this.displayName;
                if (item.id != 0) {
                    title = "Yêu cầu chỉnh sửa từ " + this.displayName;
                }
                var url = "/receiverAskingRequests";
                var detail = item.content;
                var users = [];
                users.push(item.receiver);
                pushNotif(title, detail, url, users);
            }
        },
        watch: {
            pagination: function () {
                this.getUserAskingRequests();
            },
            refreshFlag: function () {
                this.getUserAskingRequests();
            }
        }
    }
</script>

<style scoped>

</style>