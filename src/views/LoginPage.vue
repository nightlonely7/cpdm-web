<template>
    <div>
        <v-form @submit.prevent="login">
            <v-card>
                <v-card-title>Đăng nhập</v-card-title>
                <v-card-text>
                    <v-text-field v-model="email" type="email" label="Email"></v-text-field>
                    <v-text-field v-model="password" type="password" label="Mật khẩu"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn type="submit">Đăng nhập</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
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
                const email = this.email;
                const password = this.password;
                this.$store.dispatch('AUTHENTICATION/LOGIN', {email, password})
                    .then(() => this.$router.push('/tasks'))
                    .catch(error => console.log(error));
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