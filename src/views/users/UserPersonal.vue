<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline">THÔNG TIN CÁ NHÂN</span>
            </v-card-title>

            <v-card-text>
                <v-form ref="form">
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex md6>
                                <v-text-field v-model="user.displayName"
                                              label="Tên hiển thị"
                                              :rules="displayNameRule"
                                              counter="30"
                                              validate-on-blur
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field v-model="user.email"
                                              label="Email"
                                              :rules="emailRule"
                                              counter="30"
                                              name="email"
                                              validate-on-blur
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field v-model="user.fullName"
                                              label="Tên đầy đủ"
                                              :rules="fullNameRule"
                                              counter="50"
                                              validate-on-blur
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-radio-group v-model="user.gender" label="Giới tính" row>
                                    <v-radio
                                            label="Nam" :value="true" color="primary"
                                    ></v-radio>
                                    <v-radio
                                            label="Nữ" :value="false" color="error"
                                    ></v-radio>
                                </v-radio-group>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field v-model="user.phone"
                                              label="Số điện thoại"
                                              :rules="phoneRule"
                                              validate-on-blur
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field v-model="user.address"
                                              label="Địa chỉ"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-menu right offset-x class="menu-size">
                                    <v-text-field v-model="user.birthday"
                                                  label="Ngày sinh" slot="activator"
                                                  @change="formatDatePicker"
                                                  @click="formatDatePicker"
                                    ></v-text-field>
                                    <v-date-picker v-model="datePicker" label="Ngày sinh" color="green"
                                                   scrollable @change="formatDateText">
                                    </v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field v-model="this.age || 'Không xác định'"
                                              label="Tuổi"
                                              readonly
                                ></v-text-field>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field v-model="user.department.name"
                                              v-if="isStaff"
                                              label="Phòng ban"
                                              readonly
                                ></v-text-field>
                                <v-select v-model="user.department.name"
                                          label="Phòng ban"
                                          :items="departments"
                                          item-text="name"
                                          item-value="name"
                                          v-else-if="isManager"
                                >
                                </v-select>
                            </v-flex>
                            <v-flex md6>
                                <v-text-field v-model="user.role.name"
                                              label="Chức vụ"
                                              readonly
                                ></v-text-field>
                            </v-flex>
                            <!--<v-expansion-panel focusable class="elevation-1">-->
                                <!--<v-expansion-panel-content>-->
                                    <!--<template slot="header">-->
                                        <!--<div>Thay đổi mật khẩu</div>-->
                                    <!--</template>-->
                                    <!--<v-container grid-list-md>-->
                                        <!--<v-layout>-->
                                            <!--<v-flex md6>-->
                                                <!--<v-text-field v-model="user.password"-->
                                                              <!--label="Mật khẩu"-->
                                                              <!--:rules="passwordRule"-->
                                                              <!--:type="'password'"-->
                                                              <!--validate-on-blur-->
                                                <!--&gt;</v-text-field>-->
                                            <!--</v-flex>-->
                                            <!--<v-flex md6>-->
                                                <!--<v-text-field v-model="user.confirmPassword"-->
                                                              <!--label="Xác nhận mật khẩu"-->
                                                              <!--:rules="confirmPasswordRule"-->
                                                              <!--:type="'password'"-->
                                                              <!--validate-on-blur-->
                                                <!--&gt;</v-text-field>-->
                                            <!--</v-flex>-->
                                        <!--</v-layout>-->
                                    <!--</v-container>-->
                                <!--</v-expansion-panel-content>-->
                            <!--</v-expansion-panel>-->
                            <v-flex md12>
                                <p style="color: red" v-if="serverValidate">
                                    Lưu thông tin cá nhân thất bại!
                                </p>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary" @click="saveUser">
                    <v-icon left>done</v-icon>
                    Lưu
                </v-btn>
                <!--<v-btn color="primary" @click="changePassword">-->
                    <!--Thay đổi mật khẩu-->
                <!--</v-btn>-->
            </v-card-actions>

        </v-card>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import {Validator} from 'vee-validate';
    import {mapGetters} from 'vuex';

    export default {
        name: "UserPersonal",
        data() {
            return {
                user: {department: {}, role: {}},
                displayNameRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val && val.length >= 4 && val.length <= 30)
                        || 'Cần phải điền từ 4 tới 30 ý tự!'
                ],
                fullNameRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val && val.length >= 4 && val.length <= 50)
                        || 'Cần phải điền từ 4 tới 50 ý tự!'
                ],
                emailRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => /.+@.+/.test(val) || 'Email không hợp lệ!',
                ],
                phoneRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => /^0(\d{9})$/.test(val) || 'Số điện thoại không hợp lệ!'
                ],
                datePicker: '',
                serverValidate: false,
                isEmailExisted: false,
            }
        },
        computed: {
            age: function () {
                return moment().diff(moment(this.user.birthday, 'DD-MM-YYYY'), 'years');
            },
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff'
            }),
            departments: {
                get(){
                    return this.$store.state.DEPARTMENT_STORE.departments;
                },
                set(value){
                    this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENTS', value);
                }
            }
        },
        mounted() {
            this.getUser();
        },
        methods: {
            getUser: function () {
                axios.get(`http://localhost:8080/self/full`)
                    .then(response => {
                        this.user = response.data;
                        if (this.user.birthday && this.user.birthday.length) {
                            this.user.birthday = moment(this.user.birthday).format("DD-MM-YYYY");
                        }
                    })
                    .catch(error => console.log(error));
            },
            saveUser: function () {
                if (!this.$refs.form.validate()) {

                } else {
                    const user = {...this.user};
                    user.isEnabled = true;
                    user.password = '12345678';
                    axios.put(`http://localhost:8080/users/personalUpdate/${user.id}`, user)
                        .then(
                            response => {
                                this.user = response.data;
                                this.$router.push('/tasks');
                            }
                        )
                        .catch(
                            error => {
                                console.log(error);
                                this.serverValidate = true;
                            }
                        )
                }
            },
            formatDatePicker: function () {
                if (this.user.birthday != null) {
                    let time = this.user.birthday.split('-');
                    if (time[2].length === 4) {
                        this.datePicker = time[2] + '-' + time[1] + '-' + time[0];
                    }
                }
            },
            formatDateText: function () {
                if (this.datePicker != null) {
                    let time = this.datePicker.split('-');
                    if (time[0].length === 4) {
                        this.user.birthday = time[2] + '-' + time[1] + '-' + time[0];
                    }
                }
            },
        }
    }
</script>

<style scoped>
    .menu-size {
        width: 100%
    }
</style>