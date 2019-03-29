<template>
    <div>
        <v-card>
            <v-card-text v-if="showing">
                <v-text-field v-model="titleSearchValue"
                              label="Tìm bởi tên phòng ban"
                              clearable
                              @input="findTitleSearchValue"
                ></v-text-field>
                <v-text-field v-model="summarySearchValue"
                              label="Tìm bởi nội dung tổng quát"
                              clearable
                              @input="findSummarySearchValue"
                ></v-text-field>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "ProjectSearch",
        data() {
            return {
                showing: true
            }
        },
        computed: {
            titleSearchValue: {
                get() {
                    return this.$store.state.PROJECT_STORE.titleSearchValue
                },
                set(val) {
                    this.$store.commit('PROJECT_STORE/SET_TITLE_SEARCH_VALUE', val)
                }
            },
            summarySearchValue: {
                get() {
                    return this.$store.state.PROJECT_STORE.summarySearchValue
                },
                set(val) {
                    this.$store.commit('PROJECT_STORE/SET_SUMMARY_SEARCH_VALUE', val)
                }
            }
        },
        methods: {
            show: function () {
                this.showing = !this.showing;
                this.$store.commit('PROJECT_STORE/SET_TITLE_SEARCH_VALUE', '');
                this.$store.commit('PROJECT_STORE/SET_SUMMARY_SEARCH_VALUE', '');
            },
            findTitleSearchValue: function () {
                if (this.titleSearchValue === null) {
                    this.titleSearchValue = '';
                }
                axios.get("http://localhost:8080/projects/search/name",
                    {
                        params: {
                            name: this.titleSearchValue
                        }
                    })
                    .then(
                        response => {
                            this.$store.commit("PROJECT_STORE/SET_PROJECTS", response.data.content);
                        }
                    )
                    .catch(
                        err => console.log(err)
                    )
            },
            findSummarySearchValue: function () {
                if (this.titleSearchValue === null) {
                    this.titleSearchValue = '';
                }
                axios.get("http://localhost:8080/projects/search/nameAndAlias",
                    {
                        params: {
                            name: this.summarySearchValue,
                            alias: this.summarySearchValue
                        }
                    })
                    .then(
                        response => {
                            this.$store.commit("PROJECT_STORE/SET_PROJECTS", response.data.content);
                        }
                    )
                    .catch(
                        err => console.log(err)
                    )
            }
        }
    }
</script>

<style scoped>

</style>