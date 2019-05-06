<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-app>
        <v-navigation-drawer fixed app v-model="drawer" v-if="isLoggedIn && isInit">
            <v-list>
                <v-list-tile avatar>
                    <v-list-tile-avatar color="white" tile>
                        <img style="width: auto; margin-left: 100%" src='./assets/logo.png' alt="logo">
                    </v-list-tile-avatar>
                    <v-list-tile-title style="margin-left: 20%">
                        SAIGON XUÂN PHÁT
                    </v-list-tile-title>
                </v-list-tile>
                <v-divider/>
                <v-list-tile to="/departments" v-if="isAdmin">
                    <v-list-tile-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý phòng ban</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/projects" v-if="isAdmin || isManager">
                    <v-list-tile-action>
                        <v-icon>mdi-file-document</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý dự án</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/documents">
                    <v-list-tile-action>
                        <v-icon>account_circle</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý tài liệu</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/tasks">
                    <v-list-tile-action>
                        <v-icon>account_circle</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý tác vụ</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group>
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon>question_answer</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Xin ý kiến lãnh đạo</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile to="/createAskingRequests" v-if="isManager || isStaff">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Xin ý kiến</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/senderAskingRequests" v-if="isManager || isStaff">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Theo dõi</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/receiverAskingRequests" v-if="isManager || isAdmin">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Phản hồi</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-tile to="/users" v-if="isManager || isAdmin">
                    <v-list-tile-action>
                        <v-icon>mdi-file-document</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý nhân viên</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group>
                    <template v-slot:activator>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon>mdi-calendar-blank</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Quản lí nghỉ phép</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                    <v-list-tile v-if="isAdmin || isManager" to="/viewLeaveCalendar">
                    <v-list-tile-action>
                    <v-icon></v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                    <v-list-tile-title>Lịch nghỉ phép tuần</v-list-tile-title>
                    </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-if="isAdmin || isManager" to="/viewUserLeaves">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Theo dõi nghỉ phép</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/policyForLeave">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Chính sách nghỉ phép</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-if="isAdmin || isManager" to="/approverLeaveRequests">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Duyệt nghỉ phép</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-if="isStaff || isManager" to="/userLeaveRequests">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Xin nghỉ phép</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
                <v-list-group>
                    <template #activator>
                        <v-list-tile>
                            <v-list-tile-action>
                                <v-icon>assignment_ind</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>Quản lí ủy quyền</v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>

                    <v-list-tile to="/approverAssignRequests" v-if="isManager || isAdmin">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Duyệt ủy quyền</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/createUserAssignRequests" v-if="isManager || isStaff">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Xin ủy quyền</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile to="/userAssignRequests" v-if="isManager || isStaff">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Đơn ủy quyền</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list-group>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fiexed app v-if="isLoggedIn && isInit">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer/>
            <span>{{ displayName }}&nbsp; &nbsp; &nbsp;</span>
            <v-menu
                    v-show="isLoggedIn"
                    bottom
                    left
                    content-class="dropdown-menu"
                    offset-y
                    transition="slide-y-transition"
            >
                <v-btn icon slot="activator">
                    <v-badge
                            color="error"
                            overlap
                    >
                        <template slot="badge" v-if="newNotifCount > 0">
                            {{ newNotifCount }}
                        </template>
                        <v-icon color="white">mdi-bell</v-icon>
                    </v-badge>
                </v-btn>
                <v-card
                        v-if="notifications.length > 0"
                        style="max-height: 200px"
                >
                    <v-list dense>
                        <v-list-tile
                                v-for="notification in notifications"
                                :key="notification.id"
                                @click="goTo(notification)"
                                :class="(notification.read) ? '' : 'light-blue yellow--text'"
                        >
                            <v-list-tile-content>
                                <v-list-tile-title v-text="notification.title"/>
                                <v-list-tile-action-text
                                        v-text="notification.createdTime"
                                />
                            </v-list-tile-content>
                            <!--<v-icon class="v-btn&#45;&#45;icon"-->
                            <!--:class="(notification.read) ? '' : 'yellow&#45;&#45;text'"-->
                            <!--@click="hide(notification)">-->
                            <!--delete-->
                            <!--</v-icon>-->
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-menu>
            <v-menu
                    v-show="isLoggedIn"
                    bottom
                    left
                    class="ml-3"
                    content-class="dropdown-menu"
                    offset-y
                    transition="slide-y-transition"
            >
                <v-btn
                        icon
                        slot="activator"
                >
                    <v-badge>
                        <v-icon color="white">mdi-account</v-icon>
                    </v-badge>
                </v-btn>
                <v-card>
                    <v-list dense>
                        <v-list-tile to="/self">
                            <v-list-tile-title>
                                Xem thông tin
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile
                                @click="logout">
                            <v-list-tile-title>
                                Đăng xuất
                            </v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-card>
            </v-menu>
        </v-toolbar>
        <v-content @refresh="getNotifications">
            <v-container fluid>
                <router-view :key="$route.fullPath"></router-view>
            </v-container>
        </v-content>
        <v-footer color="indigo" app>
            <span class="white--text">&copy; 2019</span>
        </v-footer>
        <!--Vue-notification-->
        <notifications group="foo" position="bottom right">
            <template slot="body" slot-scope="props">
                <div style="background-color: yellow" @click="read(props.item.data.id, props.item.data.url)">
                    <a class="body-1 font-weight-bold" v-html="props.item.title"/>
                    <br/>
                    <a class="caption" v-html="props.item.text"/>
                </div>
            </template>
        </notifications>
    </v-app>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';
    import axios from 'axios';
    import {mes} from '@/firebase.js';

    export default {
        data: () => ({
            logo: './assets/logo.png',
            notifications: [],
            newNotifCount: 0,
            title: '',
            drawer: true
        }),
        props: {
            source: String
        },
        mounted() {
            this.$nextTick(() => {
                this.getNotifications();
            });
            mes.onMessage(() => {
                this.getNotifications();
            });
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
                displayName: 'displayName'
            }),
        },
        methods: {
            logout: function () {
                this.$store.dispatch('AUTHENTICATION/LOGOUT')
                    .then(() => {
                        this.$store.commit('TASK_STORE/RESET');
                        this.$router.push('/login');
                    });
            },
            getNotifications() {
                axios.get("http://localhost:8080/notifications"
                ).then(response => {
                    this.notifications = response.data;
                    if (this.notifications.length > 0) {
                        this.newNotifCount = 0;
                        for (var i in this.notifications) {
                            if (this.notifications[i].read === false) {
                                this.newNotifCount++;
                            }
                        }
                    }
                }).catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                    } else {
                        console.log(error.response);
                    }
                })
            },
            goTo(notification) {
                let updateNotification = Object.assign({}, notification)
                updateNotification.read = true;
                axios.put("http://localhost:8080/notifications/" + updateNotification.id, updateNotification
                ).then(() => {
                    this.getNotifications();
                }).catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                    } else {
                        console.log(error.response);
                    }
                })
                this.$router.push(notification.url);
            },
            read(id, url) {
                axios.put("http://localhost:8080/notifications/read/" + id
                ).then(() => {
                    this.getNotifications();
                }).catch(error => {
                    if (error.response) {
                        console.log(error.response.data);
                    } else {
                        console.log(error.response);
                    }
                })
                this.$router.push(url);
            },
            hide(notification) {
                if (confirm('Bạn muốn ẩn thông báo này?')) {
                    let updateNotification = Object.assign({}, notification)
                    updateNotification.hidden = true;
                    axios.put("http://localhost:8080/notifications/" + updateNotification.id, updateNotification
                    ).then(() => {
                    }).catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    })
                }
            }
        },
        watch: {
            '$route'(val) {
                this.title = val.name;
            },
            isLoggedIn: function(){
                if(this.isLoggedIn){
                    this.getNotifications();
                }
            },
        },
    }
</script>

<style>
    /*#app {*/
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
    /*}*/
    /*#nav {*/
    /*padding: 30px;*/
    /*}*/

    /*#nav a {*/
    /*font-weight: bold;*/
    /*color: #2c3e50;*/
    /*}*/

    /*#nav a.router-link-exact-active {*/
    /*color: #42b983;*/
    /*}*/
</style>
