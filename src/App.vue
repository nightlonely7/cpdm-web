<template>
    <v-app>
        <v-navigation-drawer fixed app v-model="drawer" v-if="isLoggedIn">
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
                <v-list-tile to="/tasks" v-if="isStaff || isManager">
                    <v-list-tile-action>
                        <v-icon>account_circle</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý tác vụ</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/users" v-if="isManager">
                    <v-list-tile-action>
                        <v-icon>mdi-file-document</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý nhân viên</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/leaveRequests">
                    <v-list-tile-action>
                        <v-icon>mdi-calendar-blank</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý nghỉ phép</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fiexed app v-if="isLoggedIn">
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
                                @click=""
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
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer color="indigo" app>
            <span class="white--text">&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    import {mapState} from 'vuex';
    import {mapGetters} from 'vuex'

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
            if (this.isLoggedIn) {
                this.init();
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                role: state => state.role,
            }),
            ...mapGetters('AUTHENTICATION', {
                isLoggedIn: 'isLoggedIn',
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            }),
        },
        methods: {
            init: function () {
                this.$store.dispatch('AUTHENTICATION/INIT')
                    .catch(() => {
                        this.$router.push('/login');
                    })
            },
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
