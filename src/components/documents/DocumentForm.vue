<template>
    <div>
        <v-dialog v-model="dialog" persistent>
            <template #activator="{on}">
                <slot name="activator" :on="on"></slot>
            </template>
            <v-card>
                <v-card-title>
                    <span class="headline">FORM</span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex md12>
                                <v-text-field v-model="documentForm.title"
                                              label="Tiêu đề"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-text-field v-model="documentForm.summary"
                                              label="Nội dung tổng quát"
                                ></v-text-field>
                            </v-flex>
                            <v-flex md12>
                                <v-select v-model="documentForm.project.id"
                                          :items="projectOptions"
                                          item-value="id"
                                          label="Thuộc dự án"
                                          prepend-inner-icon="build"
                                >
                                    <template #item="{item}">
                                        {{item.name || ''}}{{item.id === 1 ? '' : ' - '}}{{item.alias || ''}}
                                    </template>
                                    <template #selection="{item}">
                                        {{item.name || ''}}{{item.id === 1 ? '' : ' - '}}{{item.alias || ''}}
                                    </template>
                                </v-select>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-layout row justify-space-around>
                        <v-flex md2>
                            <v-btn color="secondary" @click="close" block>
                                <v-icon left>clear</v-icon>
                                Cancel
                            </v-btn>
                        </v-flex>
                        <v-flex md2>
                            <v-btn color="primary" @click="save" block :loading="saveLoading">
                                <v-icon left>done</v-icon>
                                Save
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "DocumentForm",
        data() {
            return {
                saveLoading: false,
                documentForm: {...this.form},
                dialog: false,
                projectOptions: [],
            }
        },
        props: {
            form: {
                type: Object,
                default: function () {
                    return {
                        id: 0,
                        project: {},
                    };
                }
            }
        },
        methods: {
            close() {
                this.dialog = false;
            },
            save() {
                this.saveLoading = true;
                const data = {...this.documentForm};
                const method = 'POST';
                const url = `http://localhost:8080/documents`;
                axios({url, method, data})
                    .then(() => {
                        this.close();
                        this.$emit('refresh');
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    })
                    .finally(() => {
                        this.saveLoading = false;
                    });
            },
            getProjectOptions() {
                axios.get(`http://localhost:8080/projects`)
                    .then(response => {
                        this.projectOptions = response.data;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    });
            }
        },
        mounted() {
            this.getProjectOptions();
        }
    }
</script>

<style scoped>

</style>