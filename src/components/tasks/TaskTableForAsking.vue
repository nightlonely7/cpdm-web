<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">{{title}}</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">
                <v-icon left>cached</v-icon>
                <span>Làm mới</span>
            </v-btn>
            <!--<v-menu-->
                    <!--v-model="fromDateMenu"-->
                    <!--:close-on-content-click="false"-->
                    <!--:nudge-right="40"-->
                    <!--lazy-->
                    <!--transition="scale-transition"-->
                    <!--offset-y-->
                    <!--full-width-->
                    <!--min-width="290px"-->
            <!--&gt;-->
                <!--<template v-slot:activator="{ on }">-->
                    <!--<v-text-field-->
                            <!--v-model="fromDate"-->
                            <!--label="Ngày bắt đầu"-->
                            <!--prepend-icon="event"-->
                            <!--readonly-->
                            <!--v-on="on"-->
                    <!--&gt;</v-text-field>-->
                <!--</template>-->
                <!--<v-date-picker v-model="fromDate"-->
                               <!--@input="fromDateMenu = false"></v-date-picker>-->
            <!--</v-menu>-->
            <!--<v-menu-->
                    <!--v-model="toDateMenu"-->
                    <!--:close-on-content-click="false"-->
                    <!--:nudge-right="40"-->
                    <!--lazy-->
                    <!--transition="scale-transition"-->
                    <!--offset-y-->
                    <!--full-width-->
                    <!--min-width="290px"-->
            <!--&gt;-->
                <!--<template v-slot:activator="{ on }">-->
                    <!--<v-text-field-->
                            <!--v-model="toDate"-->
                            <!--label="Ngày kết thúc"-->
                            <!--prepend-icon="event"-->
                            <!--readonly-->
                            <!--v-on="on"-->
                    <!--&gt;</v-text-field>-->
                <!--</template>-->
                <!--<v-date-picker v-model="toDate"-->
                               <!--@input="toDateMenu = false"></v-date-picker>-->
            <!--</v-menu>-->
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" @click="setDialog">Thêm mới</v-btn>
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
                                            ref="txtContent"
                                            v-model="editItem.content"
                                            label="Nội dung"
                                            :rules="[rules.required,rules.max]"
                                            clearable
                                            counter
                                            maxlength="255"
                                            auto-grow
                                    ></v-textarea>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="displayName"
                                            label="Người gửi"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md6>
                                    <v-text-field
                                            v-model="editItem.receiver.displayName"
                                            label="Người nhận"
                                            readonly
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-autocomplete v-model="taskTitles"
                                                    :items="taskTitles"
                                                    chips
                                                    label="Tác vụ liên quan"
                                                    hide-no-data
                                                    hide-selected
                                                    multiple
                                                    readonly>

                                    </v-autocomplete>
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
                :items="tasks"
                :loading="table.loading"
                :pagination.sync="pagination"
                :total-items="pagination.totalItems"
                :rows-per-page-text="'Số hàng mỗi trang'"
                :rows-per-page-items="[5, 10, 25, 50, {text: 'Tất cả', value: -1}]"
                :no-data-text="alert || 'Không có dữ liệu'"
                :no-results-text="alert || 'Không tìm thấy dữ liệu tương ứng'"
                :must-sort="true"
                v-model="selected"
                select-all
                hide-actions
        >
            <template #pageText="{pageStart, pageStop, itemsLength}">
                {{pageStart}} - {{pageStop}} của tổng cộng {{itemsLength}}
            </template>
            <template #items="props">
                <tr :active="props.selected" @click="props.selected = !props.selected">
                    <td>
                        <v-checkbox
                                :input-value="props.selected"
                                primary
                                hide-details
                        ></v-checkbox>
                    </td>
                    <td @click="storeSelectedTasks">
                        <router-link :to="`/tasks/${props.item.id}`"
                                     class="text-xs-left"
                                     onmouseover="this.style.cursor='pointer'"
                                     onmouseout="this.style.cursor='none'">
                            {{props.item.title}}
                        </router-link>
                    </td>
                    <!--<td class="text-xs-left">{{props.item.summary}}</td>-->
                    <td class="text-xs-left">{{props.item.project.name}}</td>
                    <!--<td class="text-xs-left">{{props.item.createdTime}}</td>-->
                    <td class="text-xs-left">{{props.item.startTime}}</td>
                    <td class="text-xs-left">{{props.item.endTime}}</td>
                    <!--<td class="text-xs-left">{{props.item.creator.displayName}}</td>-->
                    <!--<td class="text-xs-left">{{props.item.executor.displayName}}</td>-->
                    <td class="text-xs-left">{{props.item.priority}}</td>
                    <td class="text-xs-left">
                        <v-chip v-if="props.item.status === 'Waiting'">
                            Đang chờ
                        </v-chip>
                        <v-chip v-if="props.item.status === 'Working'" color="primary" text-color="white">
                            Đang thực hiện
                        </v-chip>
                        <v-chip v-if="props.item.status === 'Completed'" color="success" text-color="white">
                            Hoàn tất
                        </v-chip>
                        <v-chip v-if="props.item.status === 'Complete outdated'" color="error" text-color="white">
                            Hoàn tất quá hạn
                        </v-chip>
                        <v-chip v-if="props.item.status === 'Outdated'" color="error" text-color="white">
                            Quá hạn
                        </v-chip>
                        <v-chip v-if="props.item.status === 'Near deadline'" color="warning" text-color="white">
                            Gần tới hạn
                        </v-chip>
                    </td>
                    <!--<td class="text-xs-left">{{props.item.status}}</td>-->
                </tr>
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
    import moment from 'moment';
    import {mapState, mapGetters} from 'vuex';
    import {pushNotif} from '@/firebase.js';

    export default {
        name: "TaskTableForAsking",
        props: {
            title: String,
            getTasksURL: String
        },
        data() {
            return {
                snackbar: false,
                snackBarText: '',
                dialog: false,
                // fromDateMenu: false,
                // toDateMenu: false,
                // fromDate: new Date().toISOString().substr(0, 10),
                // toDate: moment(this.fromDate).add(6, 'days').toISOString().substr(0, 10),
                rules: {
                    required: v => !!v || 'Nội dung không được để trống',
                    max: v => (!!v && v.length <= 255) || 'Nội dung tối đa 255 kí tự'
                },
                defaultItem: {
                    content: '',
                    receiver: {},
                    tasks: [],
                    status: 0
                },
                editItem: {
                    content: '',
                    receiver: {},
                    tasks: [],
                    status: 0
                },
                selected: [],
                tasks: [],
                taskTitles: [],
                receivers: [],
                alert: '',
                pagination: {
                    sortBy: 'createdTime',
                    descending: true,
                    rowsPerPage: -1
                },
                table: {
                    loading: false,
                    headers: [
                        {text: 'Tiêu đề', value: 'title'},
                        // {text: 'Tổng quát', value: 'summary'},
                        {text: 'Dự án', value: 'project.name'},
                        // {text: 'Thời gian tạo', value: 'createdTime'},
                        {text: 'Thời gian bắt đầu', value: 'startTime'},
                        {text: 'Thời gian kết thúc', value: 'endTime'},
                        // {text: 'Người tạo', value: 'creator.displayName'},
                        // {text: 'Người thực hiện', value: 'executor.displayName'},
                        {text: 'Độ ưu tiên', value: 'priority'},
                        {text: 'Trạng thái', value: 'status'},
                        // {text: 'Trạng thái', value: 'status'},
                    ]
                },
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.refresh();
                this.getReceivers();
                this.getTasks();
                Object.assign(this.selected, this.selectedTasks);
            })
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
            ...mapState('ASKING_REQUEST_STORE', {
                selectedTasks: state => state.selectedTasks,
            }),
        },
        methods: {
            refresh: function () {
                this.pagination.page = 1;
                this.pagination.sortBy = 'createdTime';
                this.pagination.descending = true;
                this.getTasks();
            },
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
            getTasks: function () {
                this.table.loading = true;
                const url = `http://localhost:8080/tasks/${this.getTasksURL}`;
                const method = 'GET';
                const params = {
                    page: this.pagination.page - 1,
                    size: this.pagination.rowsPerPage,
                    sort: `${this.pagination.sortBy},${this.pagination.descending ? 'desc' : 'asc'}`,
                    fromDate: new Date(1900,0,2).toISOString().substr(0,10),
                    toDate: new Date(9999,11,32).toISOString().substr(0,10),
                };
                axios({url, method, params})
                    .then(response => {
                        this.tasks = response.data.content;
                        this.pagination.totalItems = response.data.totalElements;
                    })
                    .catch(error => {
                        this.alert = 'Không thể truy cập';
                        if (error.response) {
                            console.log(error.response.data)
                        }
                    })
                    .finally(() => {
                        this.table.loading = false;
                    })
            },
            setDialog: function () {
                //check task selected
                if (this.selected == 0) {
                    this.snackBarText = 'Tác vụ liên quan chưa được chọn';
                    this.snackbar = true;
                    return;
                }

                //set up data for dialog
                Object.assign(this.editItem.tasks, this.selected);
                this.taskTitles = [];
                this.editItem.tasks.forEach(value => this.taskTitles.push(value.title));
                Object.assign(this.editItem.receiver, this.receivers[0]);

                //reset text area
                this.$refs.txtContent.reset();

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

                axios.request(
                    {
                        url: url,
                        method: method,
                        data: this.editItem
                    }
                ).then(() => {
                        this.pushnotification(this.editItem);
                        this.close();
                        this.$emit('refresh');
                        this.refresh();
                        this.selected = [];
                        this.storeSelectedTasks();
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
            pushnotification(item){
                var title = "Yêu cầu chỉ đạo mới từ " + this.displayName;
                var url = "/receiverAskingRequests";
                var detail = item.content;
                var user = item.receiver;
                pushNotif(title,detail,url,user);
            },
            storeSelectedTasks() {
                this.$store.commit('ASKING_REQUEST_STORE/SET_SELECTED_TASK', this.selected);
            }
        },
        watch: {
            pagination: function () {
                this.getTasks();
            }
        }
    }
</script>

<style scoped>

</style>