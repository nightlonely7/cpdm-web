<template>
    <div>
        <v-form ref="form">
            <v-container grid-list-md>
                <v-layout wrap>
                    <v-flex md6>
                        <v-text-field v-model="currentPassword"
                                      label="Mật khẩu hiện tại"
                                      :rules="currentPasswordRule"
                                      :type="'password'"
                                      validate-on-blur
                        ></v-text-field>
                    </v-flex>
                    <v-flex md6></v-flex>
                    <v-flex md6>
                        <v-text-field v-model="user.password"
                                      label="Mật khẩu mới"
                                      :rules="passwordRule"
                                      :type="'password'"
                                      validate-on-blur
                        ></v-text-field>
                    </v-flex>
                    <v-flex md6></v-flex>
                    <v-flex md6>
                        <v-text-field v-model="user.confirmPassword"
                                      label="Xác nhận mật khẩu"
                                      :rules="confirmPasswordRule"
                                      :type="'password'"
                                      validate-on-blur
                        ></v-text-field>
                    </v-flex>
                    <v-flex md6></v-flex>
                    <v-flex md6>
                        <v-btn color="primary" @click="saveUser">
                            <v-icon left>done</v-icon>
                            Lưu
                        </v-btn>
                        <v-btn color="primary" @click="returnPage">
                            Quay lại
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-form>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import {mapGetters} from 'vuex';

    export default {
        name: "PasswordForm",
        data() {
            return {
                currentPasswordRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val && val.length >= 8 && val.length <= 20)
                        || 'Cần phải điền từ 8 tới 20 ý tự!',
                    val => (val === this.oldPassword) || 'Mật khẩu hiện tại không đúng!'
                ],
                passwordRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val && val.length >= 8 && val.length <= 20)
                        || 'Cần phải điền từ 8 tới 20 ý tự!',
                    val => (val !== this.currentPassword) || 'Mật khẩu mới không được trùng với mật khẩu hiện tại!'
                ],
                confirmPasswordRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val && val.length >= 8 && val.length <= 20)
                        || 'Cần phải điền từ 8 tới 20 ý tự!',
                    val => (val === this.user.password) || 'Nhập lại mật khẩu phải trùng với mật khẩu!'
                ],
                user: {
                    department: {},
                    role: {}
                },
                currentPassword: '',
                oldPassword: ''
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff'
            }),
        },
        mounted() {
            this.getUser();
        },
        methods: {
            getUser: function () {
                axios.get(`http://localhost:8080/self/full`)
                    .then(response => {
                        this.user = response.data;
                        this.oldPassword = response.data.password;
                        console.log(this.oldPassword);
                    }).catch(error => console.log(error));
            },
            saveUser: function () {
                if (!this.$refs.form.validate()) {

                } else {
                    const user = {...this.$store.state.USER_STORE.currentUser};
                    user.isEnabled = true;
                    user.password = this.user.password;
                    user.confirmPassword = this.user.confirmPassword;
                    axios.put(`http://localhost:8080/users/${user.id}`, user)
                        .then(
                            response => {
                                this.user = response.data;
                                this.$router.push('/tasks');
                            }
                        )
                        .catch(
                            error => {
                                console.log(error);
                            }
                        )
                }
            },
            returnPage: function () {
                this.$router.push('/self');
            }
        }
    }
</script>

<style scoped>

</style>