<template>
    <div>
        <v-text-field v-model="titleSearchValue"
                      label="Tìm bởi tiêu đề"
                      clearable
        ></v-text-field>
        <v-text-field v-model="summarySearchValue"
                      label="Tìm bởi nội dung tổng quát"
                      clearable
        ></v-text-field>
    </div>
</template>

<script>
    export default {
        name: "TaskSearch",
        computed: {
            titleSearchValue: {
                get() {return this.$store.state.TASK_STORE.titleSearchValue},
                set(val) {this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', val)}
            },
            summarySearchValue: {
                get() {return this.$store.state.TASK_STORE.summarySearchValue},
                set(val) {this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', val)}
            }
        }
    }
</script>

<style scoped>

</style>