<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-app>
        <v-navigation-drawer fixed app v-model="drawer" v-if="isLoggedIn && isInit">
            <v-list>
                <v-list-tile avatar>
                    <v-list-tile-avatar color="white">
                        <img src='./assets/logo.png' alt="logo">
                    </v-list-tile-avatar>
                    <v-list-tile-title>
                        SÀI GÒN XUÂN PHÁT
                    </v-list-tile-title>
                </v-list-tile>
                <v-divider/>
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

                    <v-list-tile v-if="isAdmin" to="/viewLeaveCalendar">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Lịch nghỉ phép</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile v-if="isAdmin" to="/viewUserLeaves">
                        <v-list-tile-action>
                            <v-icon></v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>Theo dõi nghỉ phép</v-list-tile-title>
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
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fiexed app v-if="isLoggedIn && isInit">
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer/>
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
                        <template slot="badge">
                            {{ notifications.length }}
                        </template>
                        <v-icon color="white">mdi-bell</v-icon>
                    </v-badge>
                </v-btn>
                <v-card>
                    <v-list dense>
                        <v-list-tile
                                v-for="notification in notifications"
                                :key="notification"
                        >
                            <v-list-tile-title
                                    v-text="notification"
                            />
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
        <v-content>
            <v-container fluid>
                <router-view :key="$route.fullPath"></router-view>
            </v-container>
        </v-content>
        <v-footer color="indigo" app>
            <span class="white--text">&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    import {mapGetters, mapState} from 'vuex';

    export default {
        data: () => ({
            logo: './assets/logo.png',
            notifications: [
                'Mike, John responded to your email',
                'You have 5 new tasks',
                'You\'re now a friend with Andrew',
                'Another Notification',
                'Another One'
            ],
            title: '',
            drawer: true
        }),
        props: {
            source: String
        },
        mounted() {

        },
        computed: {
            ...mapState('AUTHENTICATION', {
                role: state => state.role,
            }),
            ...mapGetters('AUTHENTICATION', {
                isInit: 'isInit',
                isLoggedIn: 'isLoggedIn',
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            }),
        },
        methods: {
            logout: function () {
                this.$store.dispatch('AUTHENTICATION/LOGOUT')
                    .then(() => {
                        this.$store.commit('TASK_STORE/RESET');
                        this.$router.push('/login');
                    });
            }
        },
        watch: {
            '$route'(val) {
                this.title = val.name
            }
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
