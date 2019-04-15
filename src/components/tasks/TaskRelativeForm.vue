<template>
    <v-dialog width="500" v-model="dialog" persistent>
        <template #activator="{on}">
            <slot name="activator" :on="on"></slot>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">THÊM NGƯỜI THEO DÕI</span>
            </v-card-title>

            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex md12>
                            <v-autocomplete chips deletable-chips cache-items multiple
                                            v-model="relatives"
                                            :items="viewerOptions"
                                            item-text="email"
                                            item-value="id"
                                            :loading="viewerOptionsLoading"
                                            :search-input.sync="viewerOptionsSearch"
                                            label="Người liên quan"
                                            clearable
                                            hide-no-data
                            >
                                <template #item="{item}">
                                    {{item.email}} - {{item.fullName}} - Phòng ban: {{item.department.name}}
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

    export default {
        name: "TaskRelativeForm",
        data() {
            return {
                dialog: false,
                loading: false,
                relatives: [],
                viewerOptions: [],
                viewerOptionsLoading: false,
                viewerOptionsSearch: null,
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
                const url = `http://localhost:8080/tasks/${this.taskId}/relatives`;
                const method = 'POST';
                const data = [
                    ...this.relatives.map(value => {
                        return {id: value};
                    }),
                ];
                console.log(url, method, data);
                axios({url, method, data})
                    .then((response) => {
                        console.log(response.data);
                        this.dialog = false;
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
            getViewerOptions: function (email) {
                this.viewerOptionsLoading = true;
                setTimeout(() => {
                    axios.get(`http://localhost:8080/users/search/findAllForSelectByEmailContaining`, {
                        params: {
                            email: email,
                        }
                    }).then(response => {
                        if (response.status === 204) {
                            this.viewerOptions = [];
                            return;
                        }
                        this.viewerOptions = response.data;
                    }).catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    }).finally(() => {
                        this.viewerOptionsLoading = false;
                    });
                }, 500);
            },
        },
        created() {
            this.debouncedGetViewerOptions = _.debounce(this.getViewerOptions, 500);
        },
        watch: {
            viewerOptionsSearch: function (val) {
                if (val && !!val.length) {
                    this.debouncedGetViewerOptions(val);
                }
            },
            relatives: function () {
                this.viewerOptionsSearch = '';
            }
        }
    }
</script>

<style scoped>

</style>