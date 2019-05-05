<template>
    <div>
        <v-card>
            <v-card-text v-if="showing">
                <v-form ref="form">
                    <v-text-field v-model="titleSearchValue"
                                  label="Tìm theo tên tài liệu"
                                  :rules="titleSearchRules"
                                  validation-on-blur
                                  clearable
                    ></v-text-field>
                    <v-text-field v-model="summarySearchValue"
                                  label="Tìm theo tóm tắt tài liệu"
                                  :rules="summarySearchRules"
                                  validation-on-blur
                                  clearable
                    ></v-text-field>
                    <DocumentSearchCreatedTime ref="documentSearchCreatedTime"></DocumentSearchCreatedTime>
                    <DocumentSearchStartTime ref="documentSearchStartTime"></DocumentSearchStartTime>
                    <DocumentSearchEndTime ref="documentSearchEndTime"></DocumentSearchEndTime>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import DocumentSearchCreatedTime from "./DocumentSearchCreatedTime";
    import DocumentSearchStartTime from "./DocumentSearchStartTime";
    import DocumentSearchEndTime from "./DocumentSearchEndTime";

    export default {
        name: "DocumentSearch",
        components: {DocumentSearchEndTime, DocumentSearchStartTime, DocumentSearchCreatedTime},
        data() {
            return {
                showing: true,
                charNumberRegex: /^[a-zA-Z0-9_.-]*$/,
                titleSearchRules: [
                    val => (val !== null && (val === '' || (val.match(this.charNumberRegex) !== null)))
                        || "Chỉ được điền kí tự chữ cái và chữ số, không được điền các dấu câu hay kí tự khác!"
                ],
                summarySearchRules: [
                    val => (val !== null && (val === '' || (val.match(this.charNumberRegex) !== null)))
                        || "Chỉ được điền kí tự chữ cái và chữ số, không được điền các dấu câu hay kí tự khác!"
                ],
            }
        },
        computed: {
            titleSearchValue: {
                get() {
                    return this.$store.state.DOCUMENT_STORE.titleSearchValue;
                },
                set(val) {
                    if (val !== null) {
                        if (val === '' || val.match(this.charNumberRegex)) {
                            this.$store.commit('DOCUMENT_STORE/SET_TITLE_SEARCH_VALUE', val);
                        }
                    } else {
                        this.$store.commit('DOCUMENT_STORE/SET_TITLE_SEARCH_VALUE', '');
                        this.$refs.form.resetValidation();
                    }
                }
            },
            summarySearchValue: {
                get() {
                    return this.$store.state.DOCUMENT_STORE.summarySearchValue;
                },
                set(val) {
                    if (val !== null) {
                        if (val === '' || val.match(this.charNumberRegex)) {
                            this.$store.commit('DOCUMENT_STORE/SET_SUMMARY_SEARCH_VALUE', val);
                        }
                    } else {
                        this.$store.commit('DOCUMENT_STORE/SET_SUMMARY_SEARCH_VALUE', '');
                        this.$refs.form.resetValidation();
                    }
                }
            },
        },
        methods: {
            reset() {
                this.$refs.taskSearchStartTime.reset();
                this.$refs.taskSearchCreatedTime.reset();
                this.$refs.taskSearchEndTime.reset();
                this.$store.commit('DOCUMENT_STORE/RESET_SEARCH');
            },
        }
    }
</script>

<style scoped>

</style>