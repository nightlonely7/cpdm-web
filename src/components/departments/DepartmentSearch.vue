<template>
    <div>
        <v-card>
            <v-card-text v-if="showing">
                <v-form ref="form">
                    <v-text-field v-model="nameSearchValue"
                                  label="Tìm theo tên phòng ban"
                                  :rules="nameSearchRules"
                                  validation-on-blur
                                  clearable
                    ></v-text-field>
                    <v-text-field v-model="aliasSearchValue"
                                  label="Tìm theo mã phòng ban"
                                  :rules="aliasSearchRules"
                                  validation-on-blur
                                  clearable
                    ></v-text-field>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>

    export default {
        name: "DepartmentSearch",
        data() {
            return {
                showing: true,
                charNumberRegex: /^[a-zA-Z0-9_.-]*$/,
                nameSearchRules: [
                    val => (val !== null && (val === '' || (val.match(this.charNumberRegex) !== null)))
                        || "Chỉ được điền kí tự chữ cái và chữ số, không được điền các dấu câu hay kí tự khác!"
                ],
                aliasSearchRules: [
                    val => (val !== null && (val === '' || (val.match(this.charNumberRegex) !== null)))
                        || "Chỉ được điền kí tự chữ cái và chữ số, không được điền các dấu câu hay kí tự khác!"
                ],
            }
        },
        computed: {
            nameSearchValue: {
                get() {
                    return this.$store.state.DEPARTMENT_STORE.nameSearchValue;
                },
                set(val) {
                    if (val !== null) {
                        if (val === '' || val.match(this.charNumberRegex)) {
                            this.$store.commit('DEPARTMENT_STORE/SET_NAME_SEARCH_VALUE', val);
                        }
                    } else {
                        this.$store.commit('DEPARTMENT_STORE/SET_NAME_SEARCH_VALUE', '');
                        this.$refs.form.resetValidation();
                    }
                }
            },
            aliasSearchValue: {
                get() {
                    return this.$store.state.DEPARTMENT_STORE.aliasSearchValue
                },
                set(val) {
                    if (val !== null) {
                        if (val === '' || val.match(this.charNumberRegex)) {
                            this.$store.commit('DEPARTMENT_STORE/SET_ALIAS_SEARCH_VALUE', val);
                        }
                    } else {
                        this.$store.commit('DEPARTMENT_STORE/SET_ALIAS_SEARCH_VALUE', '');
                        this.$refs.form.resetValidation();
                    }
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