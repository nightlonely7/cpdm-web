<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh()">Làm mới</v-btn>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" v-if="this.status===0" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">PHẢN HỒI</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-textarea
                                            ref="txtContent"
                                            v-model="editItem.content"
                                            label="Nội dung"
                                            readonly
                                    ></v-textarea>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-textarea
                                            ref="txtResponse"
                                            v-model="editItem.response"
                                            label="Phản hồi"
                                            :rules="[rules.required,rules.max]"
                                            clearable
                                            counter
                                            maxlength="255"
                                    ></v-textarea>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="editItem.user.displayName"
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
                                            :items="editItem.tasks"
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
                :items="receiverAskingRequests"
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
                <td class="text-xs-left">{{props.item.user.displayName}}</td>
                <td class="text-xs-left">{{props.item.createdDate}}</td>
                <td class="text-xs-left">{{props.item.content | truncate(30)}}</td>
                <td class="text-xs-left" v-if="props.item.status === 1">{{props.item.response | truncate(30)}}</td>
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
                <td class="text-xs-left">
                    <v-card-actions>
                        <v-btn outline fab small color="indigo"
                               @click="editAskingRequest(props.item)"
                               v-if="props.item.status === 0">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-dialog v-model="detailDialog" max-width="500px" v-if="props.item.status === 1">
                            <template v-slot:activator="{ on }">
                                <v-btn outline fab small color="indigo" v-on="on">
                                    <v-icon>info</v-icon>
                                </v-btn>
                            </template>
                            <v-card>
                                <v-card-title>
                                    <span class="headline">XIN Ý KIẾN LÃNH ĐẠO</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container grid-list-md>
                                        <v-layout wrap>
                                            <v-flex xs12 sm12 md12>
                                                <v-textarea
                                                        v-model="props.item.content"
                                                        label="Nội dung"
                                                        readonly
                                                ></v-textarea>
                                            </v-flex>
                                            <v-flex xs12 sm12 md12>
                                                <v-textarea
                                                        v-model="props.item.response"
                                                        label="Phản hồi"
                                                        readonly
                                                ></v-textarea>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        v-model="props.item.user.displayName"
                                                        label="Người yêu cầu"
                                                        readonly
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm6 md6>
                                                <v-text-field
                                                        v-model="props.item.receiver.displayName"
                                                        label="Người trả lời"
                                                        readonly
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex xs12 sm12 md12>
                                                <v-select
                                                        v-model="props.item.tasks"
                                                        :items="props.item.tasks"
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
                                    <v-btn color="blue darken-1" flat @click="closeDetail">ĐÓNG</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
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
    import {mapState} from 'vuex';
    import {mes, pushNotif} from "@/firebase.js";

    export default {
        name: "ReceiverAskingRequestTable",
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
                detailDialog: false,
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
                receiverAskingRequests: [],
                canLoadData: true,
                alert: '',
                pagination: {
                    sortBy: 'createdDate',
                    descending: true
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tên', value: 'user.displayName'},
                        {text: 'Ngày tạo', value: 'createdDate'},
                        {text: 'Nội dung', value: 'content'},
                        {text: 'Tác vụ liên quan', value: 'task'},

                    ]
                },
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                displayName: state => state.displayName,
            })
        },
        mounted() {
            this.$nextTick(function() {
                switch (this.type) {
                    case 'waiting':
                        this.title = 'YÊU CẦU ĐANG CHỜ';
                        this.status = 0;
                        this.table.headers.push({text: 'Thao tác', value: 'status'});
                        break;
                    case 'replied':
                        this.title = 'YÊU CẦU ĐÃ PHẢN HỒI';
                        this.table.headers.pop();
                        this.table.headers.push({text: 'Phản hồi', value: 'response'});
                        this.table.headers.push( {text: 'Tác vụ liên quan', value: 'task'});
                        this.table.headers.push({text: 'Thao tác', value: 'status'});
                        this.status = 1;
                        break;
                }
                this.getReceiverAskingRequests();
            });
            mes.onMessage(() => {
                this.getReceiverAskingRequests();
            });
        },
        methods: {
            getReceiverAskingRequests: function () {
                this.table.loading = true;
                axios.get(`http://localhost:8080/askingRequests/search/findByReceiver`,
                    {
                        params: {
                            page: this.pagination.page - 1,
                            size: this.pagination.rowsPerPage,
                            sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                            status: this.status,
                        }
                    }
                ).then(response => {
                        if (response.status === 204) {
                            this.receiverAskingRequests = [];
                            this.pagination.totalItems = 0;
                        } else {
                            this.receiverAskingRequests = response.data.content;
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
                this.getReceiverAskingRequests();
            },
            editAskingRequest: function (item) {
                //Reset content
                Object.assign(this.editItem, item);
                this.dialog = true;
                this.$refs.txtResponse.reset();
            },
            close() {
                this.dialog = false
                setTimeout(() => {
                    this.editItem = Object.assign({}, this.defaultItem)
                }, 300)
            },
            closeDetail(){
                this.detailDialog = false
            },
            save() {
                //check input condition
                if (this.editItem.content == null || this.editItem.response.trim() == '') {
                    this.snackBarText = 'Nội dung không được để trống';
                    this.snackbar = true;
                    return;
                } else if (this.editItem.response.length > 255) {
                    this.snackBarText = 'Nội dung không được quá 255 kí tự';
                    this.snackbar = true;
                    return;
                }

                //call api
                var url = `http://localhost:8080/askingRequests/` + this.editItem.id;
                var method = 'PUT';

                this.editItem.status = 1;

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.editItem
                    }
                ).then(() => {
                        this.pushnotification(this.editItem);
                        this.getReceiverAskingRequests();
                        this.snackBarText = 'Thành công';
                        this.snackbar = true;
                        this.dialog = false;
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
            pushnotification(item) {
                var title = "Yêu cầu đã xử lý bởi " + this.displayName;
                var url = "/senderAskingRequests";
                var detail = item.response;
                var users = [];
                users.push(item.user);
                pushNotif(title,detail,url,users);
            }
        },
        watch: {
            pagination: function () {
                this.getReceiverAskingRequests();
            },
            refreshFlag:function () {
                this.getReceiverAskingRequests();
            }
        }
    }
</script>

<style scoped>

</style>