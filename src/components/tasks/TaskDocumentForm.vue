<template>
    <v-dialog v-model="dialog" width="500" persistent>
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">THÊM TÀI LIỆU LIÊN QUAN</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex md12>
                            <v-autocomplete chips deletable-chips cache-items multiple
                                            v-model="documents"
                                            :items="documentOptions"
                                            item-text="title"
                                            item-value="id"
                                            :loading="documentOptionsLoading"
                                            :search-input.sync="documentOptionsSearch"
                                            label="Tài liệu liên quan"
                                            clearable
                                            hide-no-data
                            >
                                <template #item="{item}">
                                    {{item.title}} - {{item.summary}}
                                </template>
                            </v-autocomplete>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-btn color="secondary" @click="close">
                    <v-icon left>clear</v-icon>
                    Hủy
                </v-btn>
                <v-btn color="primary" @click="save" :loading="loading">
                    <v-icon left>done</v-icon>
                    Lưu
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
    import axios from 'axios';
    import {mapState} from 'vuex';

    export default {
        name: "TaskDocumentForm",
        data() {
            return {
                dialog: false,
                loading: false,
                documents: [],
                documentOptions: [],
                documentOptionsLoading: false,
                documentOptionsSearch: null,
            }
        },
        props: {
            taskId: Number,
        },
        computed: {},
        methods: {
            close: function () {
                this.dialog = false;
            },
            save: function () {
                this.loading = true;
                const url = `http://localhost:8080/tasks/${this.taskId}/documents`;
                const method = 'POST';
                const data = [
                    ...this.documents.map(value => {
                        return {id: value};
                    }),
                ];
                console.log(url, method, data);
                axios({url, method, data})
                    .then((response) => {
                        console.log(response.data);
                        this.close();
                        this.$emit("refresh");
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    })
                    .finally(() => {
                        this.loading = false;
                    })
            },
            getDocumentOptions: function (email) {
                this.documentOptionsLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/users/search/findAllForSelectByEmailContaining`, {
                        params: {
                            email: email,
                        }
                    }).then(response => {
                        if (response.status === 204) {
                            this.documentOptions = [];
                            return;
                        }
                        this.documentOptions = response.data;
                    }).catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    }).finally(() => {
                        this.documentOptionsLoading = false;
                    });
                }, 500);
            },
        },
        created() {
            this.debouncedGetDocumentOptions = _.debounce(this.getDocumentOptions, 500);
        },
        watch: {
            documentOptionsSearch: function (val) {
                if (val && !!val.length) {
                    this.debouncedGetDocumentOptions(val);
                }
            },
            documents: function () {
                this.documentOptionsSearch = '';
            }
        }
    }
</script>

<style scoped>

</style>