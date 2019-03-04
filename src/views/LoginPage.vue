<template>
    <div>
        <v-card>
            <v-card-title>Đăng nhập</v-card-title>
            <v-card-text>
                <v-text-field v-model="email" label="Email"></v-text-field>
                <v-text-field v-model="password" label="Mật khẩu"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="login">Đăng nhập</v-btn>
            </v-card-actions>
        </v-card>

    </div>
</template>

<script>
    export default {
        name: "LoginPage",
        data() {
            return {
                email: '',
                password: ''
            }
        },
        methods: {
            login: function () {
                console.log(this.email);
                this.$store.commit('SET_IS_LOGGED', true);
                this.$router.push('/tasks')
            }
        },
        mounted() {
            if (this.$store.state.isLogged) {
                this.$router.push('/tasks')
            }
        }
    }
</script>

<style scoped>
    div {
        margin: auto;
    }
</style>