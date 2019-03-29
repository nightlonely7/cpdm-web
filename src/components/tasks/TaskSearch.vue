<template>
    <div>
        <v-expansion-panel focusable class="elevation-0">
            <v-expansion-panel-content>
                <template #header>
                    <span><v-icon left>search</v-icon>Tìm kiếm</span>
                </template>
                <v-card>
                    <v-card-text v-if="showing">

                        <!--Reset Button-->
                        <v-btn @click="reset" color="primary">
                            Đặt lại
                        </v-btn>

                        <!--Title Search-->
                        <v-text-field v-model="titleSearchValue"
                                      label="Tìm bởi tiêu đề"
                                      clearable
                        ></v-text-field>

                        <!--Summary Search-->
                        <v-text-field v-model="summarySearchValue"
                                      label="Tìm bởi nội dung tổng quát"
                                      clearable
                        ></v-text-field>

                        <!--Project Search-->
                        <v-select v-model="projectIdSearchValue"
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

                        <!--Start Time Search-->
                        <TaskSearchStartTime ref="taskSearchStartTime"></TaskSearchStartTime>
                    </v-card-text>
                </v-card>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </div>
</template>

<script>
    import axios from "axios";
    import TaskSearchStartTime from "./TaskSearchStartTime";

    export default {
        name: "TaskSearch",
        components: {TaskSearchStartTime},
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
                set(val) {this.$store.commit('TASK_STORE/SET_TITLE_SEARCH_VALUE', val)}},
            summarySearchValue: {
                get() {return this.$store.state.TASK_STORE.summarySearchValue},
                set(val) {this.$store.commit('TASK_STORE/SET_SUMMARY_SEARCH_VALUE', val)}},
            projectIdSearchValue: {
                get() {return this.$store.state.TASK_STORE.projectIdSearchValue},
                set(val) {this.$store.commit('TASK_STORE/SET_PROJECT_ID_SEARCH_VALUE', val)}},
        // @formatter:on
        },

        methods: {
            reset() {
                this.$refs.taskSearchStartTime.reset();
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
        },
        mounted() {
            this.getProjectOptions();
        }
    }
</script>

<style scoped>

</style>