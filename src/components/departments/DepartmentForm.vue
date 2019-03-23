<template>
    <div>
        <v-dialog v-model="showForm" persistent>
            <v-card>
                <v-card-title>
                    <span class="headline">FORM</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-layout wrap>
                            <v-flex md12>
                                <v-text-field label="Tên phòng ban"
                                              counter="30"
                                              v-model="departmentForm.name"
                                              :rules="nameRule"
                                              v-validate="'depNameValidator'"
                                              name="name"
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
        data(){
            return {
                department: {},
                nameRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!"
                ]
            }
        },
        computed: {
            ...mapState('DEPARTMENT_STORE', {
                showForm: state => state.showForm,
                departmentForm: state => state.departmentForm,
            })
        },
        methods: {
            close: function(){
                this.$store.commit('DEPARTMENT_STORE/SET_SHOW_FORM', false);
            },
            save: function () {
                const url = `http://localhost:8080/departments${this.departmentForm.id === 0 ? `` : ('/' + this.departmentForm.id)}`;
                const method = this.departmentForm.id === 0 ? 'POST' : 'PUT';
                axios({
                    url: url,
                    method: method,
                    data: this.departmentForm
                }).then(
                    response => {
                        this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_FORM', response.data);
                        this.$store.commit('DEPARTMENT_STORE/SET_IS_EDIT', true);
                        this.$router.push(`/departments/${this.departmentForm.id}`);
                        this.close();
                    }
                ).catch(
                    err => {
                        console.log(err);
                    }
                )
            }
        }
    }
</script>

<style scoped>

</style>