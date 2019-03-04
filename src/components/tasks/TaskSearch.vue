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
                get() {return this.$store.state.titleSearchValue},
                set(val) {this.$store.commit('SET_TITLE_SEARCH_VALUE', val)}
            },
            summarySearchValue: {
                get() {return this.$store.state.summarySearchValue},
                set(val) {this.$store.commit('SET_SUMMARY_SEARCH_VALUE', val)}
            }
        }
    }
</script>

<style scoped>

</style>