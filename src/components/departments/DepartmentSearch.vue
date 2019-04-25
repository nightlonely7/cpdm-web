<template>
    <div>
        <v-card>
            <v-card-text v-if="showing">
                <v-text-field v-model="nameSearchValue"
                              label="Tìm theo tên phòng ban"
                              clearable
                ></v-text-field>
                <v-text-field v-model="aliasSearchValue"
                              label="Tìm theo mã phòng ban"
                              clearable
                ></v-text-field>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    export default {
        name: "DepartmentSearch",
        data() {
            return {
                showing: true
            }
        },
        computed: {
            nameSearchValue: {
                get() {
                    return this.$store.state.DEPARTMENT_STORE.nameSearchValue
                },
                set(val) {
                    this.$store.commit('DEPARTMENT_STORE/SET_NAME_SEARCH_VALUE', val === null ? '' : val);
                }
            },
            aliasSearchValue: {
                get() {
                    return this.$store.state.DEPARTMENT_STORE.aliasSearchValue
                },
                set(val) {
                    this.$store.commit('DEPARTMENT_STORE/SET_ALIAS_SEARCH_VALUE', val === null ? '' : val);
                }
            }
        },
        methods: {
            show: function () {
                this.showing = !this.showing;
                this.$store.commit('DEPARTMENT_STORE/SET_NAME_SEARCH_VALUE', '');
                this.$store.commit('DEPARTMENT_STORE/SET_ALIAS_SEARCH_VALUE', '');
            }
        }
    }
</script>

<style scoped>

</style>