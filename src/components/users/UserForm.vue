<template>
    <div>
        <v-dialog v-model="dialog" persistent max-width="500">
            <template #activator="{on}">
                <slot name="activator" :on="on"></slot>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">FORM NHÂN VIÊN</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex md12>
                                <v-text-field v-model="userForm.email"
                                              label="Email"
                                              name="email"
                                              v-validate="{emailValidator: [currentEmail, creating]}"
                                              :rules="emailRule"
                                              validate-on-blur
                                ></v-text-field>
                                <span style="color: red">{{errors.first("email")}}</span>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-if="userForm.id === 0"
                                              v-model="userForm.password"
                                              type="password"
                                              label="Mật khẩu"
                                              :rules="passwordRule"
                                              validate-on-blur
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6 v-if="isAdmin">
                                <v-select v-model="userForm.department.id"
                                          :items="departmentOptions"
                                          item-text="name"
                                          item-value="id"
                                          label="Phòng ban"
                                ></v-select>
                            </v-flex>
                            <v-flex md6 v-if="isAdmin">
                                <v-select v-model="userForm.role.id"
                                          :items="[{text: 'NHÂN VIÊN', value: 1},{text: 'QUẢN LÝ PHÒNG BAN', value: 2}]"
                                          label="Chức vụ"
                                ></v-select>
                            </v-flex>
                            <v-flex md12>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-btn color="secondary" @click="close">
                        <v-icon left>clear</v-icon>
                        Hủy
                    </v-btn>
                    <v-btn color="primary" @click="save">
                        <v-icon left>done</v-icon>
                        Lưu
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :top="true">
            {{serverErrorText}}
            <v-btn color="info" @click="snackbar = false">
                Đóng
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex'
    import {mapGetters} from 'vuex'
    import moment from 'moment'
    import 'vee-validate'

    export default {
        name: "UserForm",
        data() {
            return {
                departmentOptions: [],
                snackbar: false,
                serverErrorText: 'Lưu thông tin thất bại!',
                dialog: false,
                emailRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                ],
                passwordRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!"
                ]
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
            })
        },
        props: {
            userForm: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        displayName: '',
                        fullName: '',
                        email: '',
                        password: '',
                        gender: false,
                        birthday: null,
                        phone: '',
                        address: '',
                        role: {
                            id: 1,
                            name: 'ROLE_STAFF'
                        },
                        department: {
                            id: 1,
                            name: 'New Department 1',
                            alias: 'NEW1',
                            available: true
                        },
                    }
                }
            },
            creating: {
                type: Boolean,
                default: function () {
                    return false;
                }
            },
            currentEmail: {
                type: String,
                default: function () {
                    return '';
                }
            },
        },
        methods: {
            save: function () {
                console.log(this.userForm);
                const userForm = {...this.userForm};
                userForm.phone = "0123456789";
                userForm.password = '12345678';
                if(userForm.id === 0){
                    userForm.displayName = this.userForm.email;
                    userForm.fullName = this.userForm.email;
                }

                const url = `http://localhost:8080/users/${userForm.id === 0 ? '' : userForm.id}`;
                const method = `${userForm.id === 0 ? 'POST' : 'PUT'}`;
                axios.request({
                    url: url,
                    method: method,
                    data: userForm
                }).then(() => {
                    this.close();
                    this.$emit('refresh');
                }).catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                            this.snackbar = true;
                            this.serverErrorText = 'Lưu thông tin thất bại!';
                        }
                    }
                );
            },
            close: function () {
                this.dialog = false;
            },
            loadDepartmentOptions: function () {
                axios.get(`http://localhost:8080/departments/search/all`)
                    .then(response => {
                        this.departmentOptions = response.data;
                    })
            }
        },
        mounted() {
            console.log(this.userForm);
            this.loadDepartmentOptions();
        }
    }
</script>

<style scoped>

</style>