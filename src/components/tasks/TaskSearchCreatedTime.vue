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
                            Tìm theo thời gian tác vụ được tạo
                        </span>
                    </template>
                    <v-card class="elevation-2">
                        <v-card-text>
                            <v-btn @click="reset" color="primary">Đặt lại</v-btn>
                            <v-layout row wrap>
                                <!--Created Date From-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="createdDateFromDialog"
                                            v-model="createdDateFromMenu"
                                            :return-value.sync="createdDateFrom"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="createdDateFrom"
                                                    label="Ngày tạo từ"
                                                    prepend-inner-icon="mdi-calendar"
                                                    readonly
                                                    clearable
                                                    @click:clear="clearCreatedDateFrom"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                v-if="createdDateFromMenu"
                                                v-model="createdDateFrom"
                                                :max="createdDateTo"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="createdDateFromMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveCreatedDateFrom">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--Created Date To-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="createdDateToDialog"
                                            v-model="createdDateToMenu"
                                            :return-value.sync="createdDateTo"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="createdDateTo"
                                                    label="Ngày tạo đến"
                                                    prepend-inner-icon="mdi-calendar"
                                                    readonly
                                                    clearable
                                                    @click:clear="clearCreatedDateTo"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                v-if="createdDateToMenu"
                                                v-model="createdDateTo"
                                                :min="createdDateFrom"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="createdDateToMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveCreatedDateTo">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--Created Time From-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="createdTimeFromDialog"
                                            v-model="createdTimeFromMenu"
                                            :return-value.sync="createdTimeFrom"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="createdTimeFrom"
                                                    label="Thời gian tạo từ"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    clearable
                                                    :disabled="createdDateFrom == null"
                                                    @click:clear="clearCreatedTimeFrom"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="createdTimeFromMenu"
                                                v-model="createdTimeFrom"
                                                :max="maxCreatedTimeFrom"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="createdTimeFromMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveCreatedTimeFrom">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--Created Time To-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="createdTimeToDialog"
                                            v-model="createdTimeToMenu"
                                            :return-value.sync="createdTimeTo"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="createdTimeTo"
                                                    label="Thời gian tạo đến"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    clearable
                                                    :disabled="createdDateTo == null"
                                                    @click:clear="clearCreatedTimeTo"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="createdTimeToMenu"
                                                v-model="createdTimeTo"
                                                :min="minCreatedTimeTo"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="createdTimeToMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveCreatedTimeTo">OK</v-btn>
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
        name: "TaskSearchCreatedTime",
        data() {
            return {
                createdDateFrom: null,
                createdTimeFrom: null,
                createdDateTo: null,
                createdTimeTo: null,
                createdDateFromMenu: false,
                createdTimeFromMenu: false,
                createdDateToMenu: false,
                createdTimeToMenu: false,
            }
        },
        computed: {
            maxCreatedTimeFrom() {
                if (this.createdDateFrom !== this.createdDateTo) {
                    return null;
                }
                return this.createdTimeTo;
            },
            createdTimeFromComputed() {
                if (this.createdDateFrom) {
                    if (this.createdTimeFrom) {
                        return `${this.createdDateFrom}T${this.createdTimeFrom}:00.000`;
                    }
                    return `${this.createdDateFrom}T00:00:00.000`;
                }
                return null;
            },
            minCreatedTimeTo() {
                if (this.createdDateFrom !== this.createdDateTo) {
                    return null;
                }
                return this.createdTimeFrom;
            },
            createdTimeToComputed() {
                if (this.createdDateTo) {
                    if (this.createdTimeTo) {
                        return `${this.createdDateTo}T${this.createdTimeTo}:00.000`;
                    }
                    if (this.createdDateFrom === this.createdDateTo) {
                        return `${this.createdDateTo}T${this.createdTimeFrom || '00:00'}:00.000`;
                    }
                    return `${this.createdDateTo}T00:00:00.000`;
                }
                return null;
            },
        },
        methods: {
            reset() {
                this.createdDateFrom = null;
                this.createdDateTo = null;
                this.createdTimeFrom = null;
                this.createdTimeTo = null;
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_FROM_SEARCH_VALUE', null);
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_TO_SEARCH_VALUE', null);
            },
            clearCreatedDateFrom() {
                this.createdTimeFrom = null;
                this.createdDateFrom = null;
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_FROM_SEARCH_VALUE', this.createdTimeFromComputed);
            },
            saveCreatedDateFrom() {
                this.$refs.createdDateFromDialog.save(this.createdDateFrom);
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_FROM_SEARCH_VALUE', this.createdTimeFromComputed);
            },
            clearCreatedTimeFrom() {
                this.createdTimeFrom = null;
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_FROM_SEARCH_VALUE', this.createdTimeFromComputed);
            },
            saveCreatedTimeFrom() {
                this.$refs.createdTimeFromDialog.save(this.createdTimeFrom);
                if (this.createdDateFrom === this.createdDateTo) {
                    this.$store.commit('TASK_STORE/SET_CREATED_TIME_TO_SEARCH_VALUE', this.createdTimeToComputed);
                }
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_FROM_SEARCH_VALUE', this.createdTimeFromComputed);
            },
            clearCreatedDateTo() {
                this.createdTimeTo = null;
                this.createdDateTo = null;
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_TO_SEARCH_VALUE', this.createdTimeToComputed);
            },
            saveCreatedDateTo() {
                this.$refs.createdDateToDialog.save(this.createdDateTo);
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_TO_SEARCH_VALUE', this.createdTimeToComputed);
            },
            clearCreatedTimeTo() {
                this.createdTimeTo = null;
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_TO_SEARCH_VALUE', this.createdTimeToComputed);
            },
            saveCreatedTimeTo() {
                this.$refs.createdTimeToDialog.save(this.createdTimeTo);
                this.$store.commit('TASK_STORE/SET_CREATED_TIME_TO_SEARCH_VALUE', this.createdTimeToComputed);
            },
        }
    }
</script>

<style scoped>
    .header {
        background-color: #e4e1df !important;
    }

    .header:hover {
        background-color: #ffcb05 !important;
    }
</style>