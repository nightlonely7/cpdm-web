<template>
    <div>
        <v-card>
            <v-card-text v-if="showing">
                <v-text-field v-model="titleSearchValue"
                              label="Tìm bởi tên phòng ban"
                              clearable
                              @input="findTitleSearchValue"
                              validate-on-blur
                ></v-text-field>
                <v-text-field v-model="summarySearchValue"
                              label="Tìm bởi nội dung tổng quát"
                              clearable
                              @input="findSummarySearchValue"
                              validate-on-blur
                ></v-text-field>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "DepartmentSearch",
        data() {
            return {
                showing: true
            }
        },
        computed: {
            titleSearchValue: {
                get() {
                    return this.$store.state.DEPARTMENT_STORE.titleSearchValue
                },
                set(val) {
                    this.$store.commit('DEPARTMENT_STORE/SET_TITLE_SEARCH_VALUE', val)
                }
            },
            summarySearchValue: {
                get() {
                    return this.$store.state.DEPARTMENT_STORE.summarySearchValue
                },
                set(val) {
                    this.$store.commit('DEPARTMENT_STORE/SET_SUMMARY_SEARCH_VALUE', val)
                }
            }
        },
        methods: {
            show: function () {
                this.showing = !this.showing;
                this.$store.commit('DEPARTMENT_STORE/SET_TITLE_SEARCH_VALUE', '');
                this.$store.commit('DEPARTMENT_STORE/SET_SUMMARY_SEARCH_VALUE', '');
            },
            findTitleSearchValue: function () {
                if (this.titleSearchValue === null) {
                    this.titleSearchValue = '';
                }
                axios.get("http://localhost:8080/departments/search/name",
                    {
                        params: {
                            name: this.titleSearchValue
                        }
                    })
                    .then(
                        response => {
                            this.$store.commit("DEPARTMENT_STORE/SET_DEPARTMENTS", response.data.content);
                        }
                    )
                    .catch(
                        err => console.log(err)
                    )
            },
            findSummarySearchValue: function () {
                if (this.summarySearchValue === null) {
                    this.summarySearchValue = '';
                }
                axios.get("http://localhost:8080/departments/search/nameAndAlias",
                    {
                        params: {
                            name: this.summarySearchValue,
                            alias: this.summarySearchValue
                        }
                    })
                    .then(
                        response => {
                            this.$store.commit("DEPARTMENT_STORE/SET_DEPARTMENTS", response.data.content);
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