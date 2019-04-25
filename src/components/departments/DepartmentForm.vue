<template>
    <div>
        <v-dialog v-model="dialog" persistent>
            <template #activator="{on}">
                <slot name="activator" :on="on"></slot>
            </template>
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
                                                  v-validate="{depNameValidator: [departmentName, creating]}"
                                                  name="name"
                                                  validate-on-blur>
                                    ></v-text-field>
                                    <p style="color: red">{{ errors.first('name') }}</p>
                                </v-flex>
                                <v-flex md12>
                                    <v-text-field label="Mã phòng ban"
                                                  counter="30"
                                                  :rules="aliasRule"
                                                  name="alias"
                                                  v-validate="{depAliasValidator: [departmentAlias, creating]}"
                                                  v-model="departmentForm.alias"
                                                  validate-on-blur
                                    ></v-text-field>
                                    <p style="color: red">{{ errors.first('alias') }}</p>
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
    import 'vee-validate';

    export default {
        name: "DepartmentForm",
        data() {
            return {
                department: {},
                nameRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val.length >= 3 && val.length <= 50) || "Cần phải điền từ 3 tới 50 kí tự!"
                ],
                aliasRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!",
                    val => (val.length >= 3 && val.length <= 50) || "Cần phải điền từ 3 tới 50 kí tự!"
                ],
                snackbar: false,
                serverErrorText: 'Lưu thông tin thất bại!',
                timeout: 10000,
                dialog: false,
                departmentName: '',
                departmentAlias: '',
            }
        },
        computed: {
        },
        mounted(){
            if(this.departmentForm.id !== 0){
                this.departmentName = this.departmentForm.name;
                this.departmentAlias = this.departmentForm.alias;
            }
            console.log(this.departmentForm);
        },
        props: {
            departmentForm: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        name: '',
                        alias: '',
                    };
                }
            },
            creating: {
                type: Boolean,
                default: function () {
                    return false;
                }
            }
        },
        methods: {
            close: function () {
                this.snackbar = false;
                this.dialog = false;
            },
            save: function () {
                const departmentForm = {...this.departmentForm};
                if(typeof this.errors.first('name') !== 'undefined'){
                    this.snackbar = true;
                }
                if (this.$refs.form.validate() && (typeof this.errors.first('name') === 'undefined')) {
                    const url = `http://localhost:8080/departments${departmentForm.id === 0 ? `` : ('/' + departmentForm.id)}`;
                    const method = departmentForm.id === 0 ? 'POST' : 'PUT';
                    axios({
                        url: url,
                        method: method,
                        data: departmentForm
                    }).then(
                        () => {
                            this.close();
                            this.$emit("refresh");
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