<template>
    <v-hover>
        <template #default="{hover}">
            <v-expansion-panel>
                <v-expansion-panel-content :class="`${hover ? 'primary' : ''}`" ripple>
                    <template #actions>
                        <v-icon :color="`${hover ? 'white' : 'primary'}`">$vuetify.icons.expand</v-icon>
                    </template>
                    <template #header>
                        <span :style="`color: ${hover ? 'white' : ''}`">
                            <v-icon left :color="`${hover ? 'white' : 'primary'}`">date_range</v-icon>
                            Tìm theo thời gian tác vụ bắt đầu
                        </span>
                    </template>
                    <v-card class="elevation-2">
                        <v-card-text>
                            <v-btn @click="reset" color="primary">Đặt lại</v-btn>
                            <v-layout row wrap>

                                <!--Start Date From-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="startDateFromDialog"
                                            v-model="startDateFromMenu"
                                            :return-value.sync="startDateFrom"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="startDateFrom"
                                                    label="Ngày bắt đầu từ"
                                                    prepend-inner-icon="mdi-calendar"
                                                    readonly
                                                    clearable
                                                    @click:clear="clearStartDateFrom"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                v-if="startDateFromMenu"
                                                v-model="startDateFrom"
                                                :max="startDateTo"
                                                full-width
                                                locale="vi-vn"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="startDateFromMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveStartDateFrom">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--Start Date To-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="startDateToDialog"
                                            v-model="startDateToMenu"
                                            :return-value.sync="startDateTo"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="startDateTo"
                                                    label="Ngày bắt đầu đến"
                                                    prepend-inner-icon="mdi-calendar"
                                                    readonly
                                                    @click:clear="clearStartDateTo"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                v-if="startDateToMenu"
                                                v-model="startDateTo"
                                                :min="startDateFrom"
                                                full-width
                                                locale="vi-vn"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="startDateToMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveStartDateTo">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--Start Time From-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="startTimeFromDialog"
                                            v-model="startTimeFromMenu"
                                            :return-value.sync="startTimeFrom"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="startTimeFrom"
                                                    label="Thời gian bắt đầu từ"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    clearable
                                                    :disabled="startDateFrom == null"
                                                    @click:clear="clearStartTimeFrom"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="startTimeFromMenu"
                                                v-model="startTimeFrom"
                                                :max="maxStartTimeFrom"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="startTimeFromMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveStartTimeFrom">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--Start Time To-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="startTimeToDialog"
                                            v-model="startTimeToMenu"
                                            :return-value.sync="startTimeTo"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="startTimeTo"
                                                    label="Thời gian bắt đầu đến"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    :disabled="startDateTo == null"
                                                    @click:clear="clearStartTimeTo"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="startTimeToMenu"
                                                v-model="startTimeTo"
                                                :min="minStartTimeTo"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="startTimeToMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveStartTimeTo">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </v-flex>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </template>
    </v-hover>
</template>

<script>
    export default {
        name: "TaskSearchStartTime",
        data() {
            return {
                startDateFrom: null,
                startTimeFrom: null,
                startDateTo: null,
                startTimeTo: null,
                startDateFromMenu: false,
                startTimeFromMenu: false,
                startDateToMenu: false,
                startTimeToMenu: false,
            }
        },
        computed: {
            maxStartTimeFrom() {
                if (this.startDateFrom !== this.startDateTo) {
                    return null;
                }
                return this.startTimeTo;
            },
            startTimeFromComputed() {
                if (this.startDateFrom) {
                    if (this.startTimeFrom) {
                        return `${this.startDateFrom}T${this.startTimeFrom}:00.000`;
                    }
                    return `${this.startDateFrom}T00:00:00.000`;
                }
                return null;
            },
            minStartTimeTo() {
                if (this.startDateFrom !== this.startDateTo) {
                    return null;
                }
                return this.startTimeFrom;
            },
            startTimeToComputed() {
                if (this.startDateTo) {
                    if (this.startTimeTo) {
                        return `${this.startDateTo}T${this.startTimeTo}:00.000`;
                    }
                    if (this.startDateFrom === this.startDateTo) {
                        return `${this.startDateTo}T${this.startTimeFrom || '00:00'}:00.000`;
                    }
                    return `${this.startDateTo}T00:00:00.000`;
                }
                return null;
            },
        },
        methods: {
            reset() {
                this.startDateFrom = null;
                this.startDateTo = null;
                this.startTimeFrom = null;
                this.startTimeTo = null;
                this.$store.commit('TASK_STORE/SET_START_TIME_FROM_SEARCH_VALUE', null);
                this.$store.commit('TASK_STORE/SET_START_TIME_TO_SEARCH_VALUE', null);
            },
            clearStartDateFrom() {
                this.startTimeFrom = null;
                this.startDateFrom = null;
                this.$store.commit('TASK_STORE/SET_START_TIME_FROM_SEARCH_VALUE', this.startTimeFromComputed);
            },
            saveStartDateFrom() {
                this.$refs.startDateFromDialog.save(this.startDateFrom);
                this.$store.commit('TASK_STORE/SET_START_TIME_FROM_SEARCH_VALUE', this.startTimeFromComputed);
            },
            clearStartTimeFrom() {
                this.startTimeFrom = null;
                this.$store.commit('TASK_STORE/SET_START_TIME_FROM_SEARCH_VALUE', this.startTimeFromComputed);
            },
            saveStartTimeFrom() {
                this.$refs.startTimeFromDialog.save(this.startTimeFrom);
                if (this.startDateFrom === this.startDateTo) {
                    this.$store.commit('TASK_STORE/SET_START_TIME_TO_SEARCH_VALUE', this.startTimeToComputed);
                }
                this.$store.commit('TASK_STORE/SET_START_TIME_FROM_SEARCH_VALUE', this.startTimeFromComputed);
            },
            clearStartDateTo() {
                this.startTimeTo = null;
                this.startDateTo = null;
                this.$store.commit('TASK_STORE/SET_START_TIME_TO_SEARCH_VALUE', this.startTimeToComputed);
            },
            saveStartDateTo() {
                this.$refs.startDateToDialog.save(this.startDateTo);
                this.$store.commit('TASK_STORE/SET_START_TIME_TO_SEARCH_VALUE', this.startTimeToComputed);
            },
            clearStartTimeTo() {
                this.startTimeTo = null;
                this.$store.commit('TASK_STORE/SET_START_TIME_TO_SEARCH_VALUE', this.startTimeToComputed);
            },
            saveStartTimeTo() {
                this.$refs.startTimeToDialog.save(this.startTimeTo);
                this.$store.commit('TASK_STORE/SET_START_TIME_TO_SEARCH_VALUE', this.startTimeToComputed);
            },
        }
    }
</script>

<style scoped>

</style>