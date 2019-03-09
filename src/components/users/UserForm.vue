<template>
    <div>
        <v-dialog v-model="showForm" persistent max-width="500">
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
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-if="userForm.id === 0"
                                              v-model="userForm.password"
                                              type="password"
                                              label="Mật khẩu"
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
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex'
    import {mapGetters} from 'vuex'

    export default {
        name: "UserForm",
        data() {
            return {
                departmentOptions: [],
            }
        },
        computed: {
            ...mapState('USER_STORE', {
                showForm: state => state.showForm,
                userForm: state => state.userForm
            }),
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
            })
        },
        methods: {
            save: function () {
                console.log(this.userForm);

                const url = `http://localhost:8080/users/${this.userForm.id === 0 ? '' : this.userForm.id}`;
                const method = `${this.userForm.id === 0 ? 'POST' : 'PUT'}`;
                axios.request({
                    url: url,
                    method: method,
                    data: this.userForm
                })
                    .then(() => {
                        this.close();
                        this.$emit('refresh');
                    })
                    .catch(error => {
                            if (error.response) {
                                console.log(error.response.data)
                            }
                        }
                    );
            },
            close: function () {
                this.$store.commit('USER_STORE/SET_SHOW_FORM', false);
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