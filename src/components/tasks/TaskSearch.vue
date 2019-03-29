<template>
    <div>
        <v-card>
            <v-card-text v-if="showing">
                <v-btn @click="reset" color="primary">Đặt lại</v-btn>
                <v-text-field v-model="titleSearchValue"
                              label="Tìm bởi tiêu đề"
                              clearable
                ></v-text-field>
                <v-text-field v-model="summarySearchValue"
                              label="Tìm bởi nội dung tổng quát"
                              clearable
                ></v-text-field>
                <v-select v-model="projectSelected"
                          :items="projectOptions"
                          item-value="id"
                          label="Thuộc dự án"
                          prepend-inner-icon="build"
                          append-outer-icon="cached"
                          @click:append-outer="getProjectOptions"
                          :loading="projectOptionsLoading"
                >
                    <template #item="{item}">
                        {{item.name || ''}} - {{item.alias || ''}}
                    </template>
                    <template #selection="{item}">
                        {{item.name || ''}} - {{item.alias || ''}}
                    </template>
                </v-select>
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
                projectOptionsLoading: false,
                showing: true,
                showBtnText: 'Ẩn',
                projectOptions: [],
            }
        },
        // @formatter:off
        computed: {
            titleSearchValue: {
                get() {return this.$store.state.TASK_STORE.titleSearchValue},
                set(val) {this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', val)}
            },
            summarySearchValue: {
                get() {return this.$store.state.TASK_STORE.summarySearchValue},
                set(val) {this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', val)}
            },
            projectSelected: {
                get() {return this.$store.state.TASK_STORE.projectSelected},
                set(val) {this.$store.commit('TASK_STORE/SET_PROJECT_SELECTED', val)}
            }
        },
        methods: {
            reset() {
                this.$store.commit('TASK_STORE/RESET_SEARCH');
            },
            getProjectOptions() {
                this.projectOptionsLoading = true;

                axios.get(`http://localhost:8080/projects`)
                    .then(response => {
                        this.projectOptions = response.data;
                    })
                    .catch(error => {
                        if (error.response) {
                            console.log(error.response.data);
                        } else {
                            console.log(error.response);
                        }
                    })
                    .finally(() => {
                        this.projectOptionsLoading = false;
                    });
            },
            show: function () {
                this.showing = !this.showing;
                this.showing ? this.showBtnText = 'Ẩn' : this.showBtnText = 'Hiện';
                this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', '');
                this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', '');
            }
        },
        mounted() {
            this.getProjectOptions();
        }
    }
</script>

<style scoped>

</style>