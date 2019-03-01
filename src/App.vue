<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" fixed app>
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
                <v-list-tile to="/tasks">
                    <v-list-tile-action>
                        <v-icon>account_circle</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý tác vụ</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile to="/document">
                    <v-list-tile-action>
                        <v-icon>mdi-file-document</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Quản lý văn bản</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar color="indigo" dark fiexed app>
            <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer/>
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
