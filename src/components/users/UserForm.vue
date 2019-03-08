<template>
    <div>
        <v-dialog v-model="showForm" persistent>
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
                                <v-text-field v-model="userForm.password"
                                              label="Mật khẩu"
                                ></v-text-field>
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

    export default {
        name: "UserForm",
        computed: {
            ...mapState('USER_STORE', {
                showForm: state => state.showForm,
                userForm: state => state.userForm
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
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>