<template>
    <div>
        <v-form @submit.prevent="login" style="width: 500px; margin: auto">
            <v-card>
                <v-card-title>Đăng nhập</v-card-title>
                <v-card-text>
                    <v-text-field v-model="email" type="email" label="Email"></v-text-field>
                    <v-text-field v-model="password" type="password" label="Mật khẩu"></v-text-field>
                    <v-alert v-model="alert" dismissible transition="scale-transition">Đăng nhập thất bại</v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-btn type="submit" color="primary" :loading="loading">Đăng nhập</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>
</template>

<script>
    import {mapState} from 'vuex';

    export default {
        name: "LoginPage",
        data() {
            return {
                email: '',
                password: '',
                alert: false
            }
        },
        computed: {
            ...mapState('AUTHENTICATION', {
                loading: state => state.status === 'loading',
            })
        },
        methods: {
            login: function () {
                this.alert = false;
                const email = this.email;
                const password = this.password;
                this.$store.dispatch('AUTHENTICATION/LOGIN', {email, password})
                    .then(() => {
                        this.$store.dispatch('AUTHENTICATION/INIT')
                            .then(() => this.$router.push('/tasks'))
                            .catch(() => this.$router.push('/login'));
                    })
                    .catch(() => this.alert = true);
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>
    div {
        margin: auto;
    }
</style>