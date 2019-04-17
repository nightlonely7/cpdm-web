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
                                    <v-text-field label="Tên dự án"
                                                  counter="50"
                                                  v-model="projectForm.name"
                                                  :rules="nameRule"
                                                  name="name"
                                                  v-validate="{projectNameValidator: [projectName, isEdit]}"
                                                  validate-on-blur>
                                        ></v-text-field>
                                    <p style="color: red">{{ errors.first('name') }}</p>
                                </v-flex>
                                <v-flex md12>
                                    <v-text-field label="Mã dự án"
                                                  v-model="projectForm.alias"
                                                  counter="50"
                                                  :rules="aliasRule"
                                                  name="alias"
                                                  v-validate="{projectNameValidator: [projectName, isEdit]}"
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
    import {mapState} from 'vuex'
    import 'vee-validate'
    import _ from 'lodash'

    export default {
        name: "ProjectForm",
        data() {
            return {
                project: {},
                nameRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!"
                ],
                aliasRule: [
                    val => !!val || "Không được để trống mục này! Xin hãy điền vào mục này!"
                ],
                snackbar: false,
                serverErrorText: 'Lưu thông tin thất bại!',
                timeout: 10000,
                dialog: false
            }
        },
        computed: {
            ...mapState('PROJECT_STORE', {
                projectName: state => state.projectName,
                projectAlias: state => state.projectAlias,
                isEdit: state => state.isEdit
            }),
        },
        props: {
            isEditing: Boolean,
            projectForm: {
                type: Object,
                default: function() {
                    return{
                        id: 0,
                        name: '',
                        alias: ''
                    }
                }
            }
        },
        methods: {
            close: function () {
                this.snackbar = false;
                const currentProject =
                    this.$store.state.PROJECT_STORE.currentProject;
                this.projectForm.id = currentProject.id;
                this.projectForm.name = currentProject.name;
                this.projectForm.alias = currentProject.alias;
                this.dialog = false;
            },
            save: function () {
                if (this.$refs.form.validate()) {
                    const url = `http://localhost:8080/projects${this.projectForm.id === 0 ? `` : ('/' + this.projectForm.id)}`;
                    const method = this.projectForm.id === 0 ? 'POST' : 'PUT';
                    axios({
                        url: url,
                        method: method,
                        data: this.projectForm
                    }).then(
                        response => {
                            this.$store.commit('PROJECT_STORE/SET_PROJECT_FORM', response.data);
                            this.$store.commit('PROJECT_STORE/SET_PROJECT_NAME', '');
                            this.$router.push(`/projects/${this.projectForm.id}`);
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