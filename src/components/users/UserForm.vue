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
                                              v-validate="{emailValidator: true}"
                                              validate-on-blur
                                ></v-text-field>
                                <span style="color: red">{{errors.first("email")}}</span>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-if="userForm.id === 0"
                                              v-model="userForm.password"
                                              type="password"
                                              label="Mật khẩu"
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

    export default {
        name: "UserForm",
        data() {
            return {
                departmentOptions: [],
                snackbar: false,
                serverErrorText: 'Lưu thông tin thất bại!',
                dialog: false
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
                        birthDay: moment().format("YYYY-MM-DD"),
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
                        }
                    }
                }
            }
        },
        methods: {
            save: function () {
                console.log(this.userForm);
                this.userForm.password = '12345678';

                const url = `http://localhost:8080/users/${this.userForm.id === 0 ? '' : this.userForm.id}`;
                const method = `${this.userForm.id === 0 ? 'POST' : 'PUT'}`;
                axios.request({
                    url: url,
                    method: method,
                    data: this.userForm
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