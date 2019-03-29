<template>
    <div>
        <v-dialog v-model="showForm" persistent>
            <v-card>
                <v-snackbar v-model="snackbar" :top="true" :absolute="true" :timeout="timeout">
                    {{serverErrorText}}
                    <v-btn color="info" @click="snackbar = false">
                        Đóng
                    </v-btn>
                </v-snackbar>
                <v-card-title>
                    <span class="headline">FORM</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-container>
                            <v-layout wrap>
                                <v-flex md12>
                                    <v-text-field label="Tên phòng ban"
                                                  counter="30"
                                                  v-model="departmentForm.name"
                                                  :rules="nameRule"
                                                  v-validate="'depNameValidator'"
                                                  name="name"
                                                  validate-on-blur>
                                    ></v-text-field>
                                    <p style="color: red">{{ errors.first('name') }}</p>
                                </v-flex>
                                <v-flex md12>
                                    <v-text-field label="Mã phòng ban"
                                                  v-model="departmentForm.alias"
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="secondary" @click="close">
                        <v-icon left>clear</v-icon>
                        Cancel
                    </v-btn>
                    <v-btn color="primary" @click="save">
                        <v-icon left>done</v-icon>
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import {mapState} from 'vuex'
    import 'vee-validate';

    export default {
        name: "DepartmentForm",
        data() {
            return {
                department: {},
                nameRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!"
                ],
                snackbar: false,
                serverErrorText: 'Lưu thông tin thất bại!',
                timeout: 10000
            }
        },
        computed: {
            ...mapState('DEPARTMENT_STORE', {
                showForm: state => state.showForm,
                departmentForm: state => state.departmentForm,
            })
        },
        methods: {
            close: function () {
                this.snackbar = false;
                this.$store.commit('DEPARTMENT_STORE/SET_SHOW_FORM', false);
                this.departmentForm.name = this.$store.state.DEPARTMENT_STORE.departmentName;
                this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_NAME', '');
            },
            save: function () {
                if(typeof this.errors.first('name') !== 'undefined'){
                    this.snackbar = true;
                }
                if (this.$refs.form.validate() && (typeof this.errors.first('name') === 'undefined')) {
                    const url = `http://localhost:8080/departments${this.departmentForm.id === 0 ? `` : ('/' + this.departmentForm.id)}`;
                    const method = this.departmentForm.id === 0 ? 'POST' : 'PUT';
                    axios({
                        url: url,
                        method: method,
                        data: this.departmentForm
                    }).then(
                        response => {
                            this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_FORM', response.data);
                            this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_NAME', '');
                            this.$router.push(`/departments/${this.departmentForm.id}`);
                            this.close();
                        }
                    ).catch(
                        err => {
                            this.snackbar = true;
                            console.log(err);
                        }
                    )
                }
            }
        }
    }
</script>

<style scoped>

</style>