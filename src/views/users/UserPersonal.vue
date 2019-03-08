<template>
    <div>
        <v-card>
            <v-card-title>
                <span class="headline">THÔNG TIN CÁ NHÂN</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex>
                            <v-text-field v-model="user.displayName"
                                          label="Tên hiển thị"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.email"
                                          label="Email"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.fullName"
                                          label="Tên đầy đủ"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.gender"
                                          label="Giới tính"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.phone"
                                          label="Số điện thoại"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.address"
                                          label="Địa chỉ"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.birthday"
                                          label="Ngày sinh"
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="this.age || 'Không xác định'"
                                          label="Tuổi"
                                          readonly
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.department.name"
                                          label="Phòng ban"
                                          readonly
                            ></v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field v-model="user.role.name"
                                          label="Chức vụ"
                                          readonly
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="primary">
                    <v-icon left>done</v-icon>
                    Lưu
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';

    export default {
        name: "UserPersonal",
        data() {
            return {
                user: {department: {}, role: {}},
            }
        },
        computed: {
            age: function () {
                return moment().diff(moment(this.user.birthday, 'DD-MM-YYYY'), 'years');
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
                            this.user.birthday = moment(this.user.birthday).format("DD-MM-YYYY")
                        }

                    })
                    .catch(error => console.log(error));
            }
        }
    }
</script>

<style scoped>

</style>