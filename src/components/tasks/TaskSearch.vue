<template>
    <div>
        <v-card>
            <v-card-text v-if="showing">
                <v-text-field v-model="titleSearchValue"
                              label="Tìm bởi tiêu đề"
                              clearable
                ></v-text-field>
                <v-text-field v-model="summarySearchValue"
                              label="Tìm bởi nội dung tổng quát"
                              clearable
                ></v-text-field>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: "TaskSearch",
        data() {
            return {
                showing: true,
                showBtnText: 'Ẩn'
            }
        },
        computed: {
            titleSearchValue: {
                get() {
                    return this.$store.state.TASK_STORE.titleSearchValue
                },
                set(val) {
                    this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', val)
                }
            },
            summarySearchValue: {
                get() {
                    return this.$store.state.TASK_STORE.summarySearchValue
                },
                set(val) {
                    this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', val)
                }
            }
        },
        methods: {
            show: function () {
                this.showing = !this.showing;
                this.showing ? this.showBtnText = 'Ẩn' : this.showBtnText = 'Hiện';
                this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', '');
                this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', '');
            }
        }
    }
</script>

<style scoped>

</style>