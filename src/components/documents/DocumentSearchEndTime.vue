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
                            Tìm theo thời gian tài liệu hết hạn
                        </span>
                    </template>
                    <v-card class="elevation-2">
                        <v-card-text>
                            <v-btn @click="reset" color="primary">Đặt lại</v-btn>
                            <v-layout row wrap>
                                <!--End Date From-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="endDateFromDialog"
                                            v-model="endDateFromMenu"
                                            :return-value.sync="endDateFrom"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="endDateFrom"
                                                    label="Ngày kết thúc từ"
                                                    prepend-inner-icon="mdi-calendar"
                                                    readonly
                                                    clearable
                                                    @click:clear="clearEndDateFrom"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                v-if="endDateFromMenu"
                                                v-model="endDateFrom"
                                                :max="endDateTo"
                                                full-width
                                                locale="vi-vn"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="endDateFromMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveEndDateFrom">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--End Date To-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="endDateToDialog"
                                            v-model="endDateToMenu"
                                            :return-value.sync="endDateTo"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="endDateTo"
                                                    label="Ngày kết thúc đến"
                                                    prepend-inner-icon="mdi-calendar"
                                                    readonly
                                                    clearable
                                                    @click:clear="clearEndDateTo"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                                v-if="endDateToMenu"
                                                v-model="endDateTo"
                                                :min="endDateFrom"
                                                full-width
                                                locale="vi-vn"
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="endDateToMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveEndDateTo">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--End Time From-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="endTimeFromDialog"
                                            v-model="endTimeFromMenu"
                                            :return-value.sync="endTimeFrom"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="endTimeFrom"
                                                    label="Thời gian kết thúc từ"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    clearable
                                                    :disabled="endDateFrom == null"
                                                    @click:clear="clearEndTimeFrom"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="endTimeFromMenu"
                                                v-model="endTimeFrom"
                                                :max="maxEndTimeFrom"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="endTimeFromMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveEndTimeFrom">OK</v-btn>
                                        </v-time-picker>
                                    </v-dialog>
                                </v-flex>

                                <!--End Time To-->
                                <v-flex xs12 sm6 md6>
                                    <v-dialog
                                            ref="endTimeToDialog"
                                            v-model="endTimeToMenu"
                                            :return-value.sync="endTimeTo"
                                            persistent
                                            lazy
                                            full-width
                                            width="290px"
                                    >
                                        <template #activator="{ on }">
                                            <v-text-field
                                                    v-model="endTimeTo"
                                                    label="Thời gian kết thúc đến"
                                                    prepend-inner-icon="access_time"
                                                    readonly
                                                    clearable
                                                    :disabled="endDateTo == null"
                                                    @click:clear="clearEndTimeTo"
                                                    v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-time-picker
                                                v-if="endTimeToMenu"
                                                v-model="endTimeTo"
                                                :min="minEndTimeTo"
                                                full-width
                                        >
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="endTimeToMenu = false">Cancel
                                            </v-btn>
                                            <v-btn flat color="primary" @click="saveEndTimeTo">OK</v-btn>
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
        name: "DocumentSearchEndTime",
        data() {
            return {
                endDateFrom: null,
                endTimeFrom: null,
                endDateTo: null,
                endTimeTo: null,
                endDateFromMenu: false,
                endTimeFromMenu: false,
                endDateToMenu: false,
                endTimeToMenu: false,
            }
        },
        computed: {
            maxEndTimeFrom() {
                if (this.endDateFrom !== this.endDateTo) {
                    return null;
                }
                return this.endTimeTo;
            },
            endTimeFromComputed() {
                if (this.endDateFrom) {
                    if (this.endTimeFrom) {
                        return `${this.endDateFrom}T${this.endTimeFrom}:00.000`;
                    }
                    return `${this.endDateFrom}T00:00:00.000`;
                }
                return null;
            },
            minEndTimeTo() {
                if (this.endDateFrom !== this.endDateTo) {
                    return null;
                }
                return this.endTimeFrom;
            },
            endTimeToComputed() {
                if (this.endDateTo) {
                    if (this.endTimeTo) {
                        return `${this.endDateTo}T${this.endTimeTo}:00.000`;
                    }
                    if (this.endDateFrom === this.endDateTo) {
                        return `${this.endDateTo}T${this.endTimeFrom || '00:00'}:00.000`;
                    }
                    return `${this.endDateTo}T00:00:00.000`;
                }
                return null;
            },
        },
        methods: {
            reset() {
                this.endDateFrom = null;
                this.endDateTo = null;
                this.endTimeFrom = null;
                this.endTimeTo = null;
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_FROM_SEARCH_VALUE', null);
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_TO_SEARCH_VALUE', null);
            },
            clearEndDateFrom() {
                this.endTimeFrom = null;
                this.endDateFrom = null;
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_FROM_SEARCH_VALUE', this.endTimeFromComputed);
            },
            saveEndDateFrom() {
                this.$refs.endDateFromDialog.save(this.endDateFrom);
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_FROM_SEARCH_VALUE', this.endTimeFromComputed);
            },
            clearEndTimeFrom() {
                this.endTimeFrom = null;
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_FROM_SEARCH_VALUE', this.endTimeFromComputed);
            },
            saveEndTimeFrom() {
                this.$refs.endTimeFromDialog.save(this.endTimeFrom);
                if (this.endDateFrom === this.endDateTo) {
                    this.$store.commit('DOCUMENT_STORE/SET_END_TIME_TO_SEARCH_VALUE', this.endTimeToComputed);
                }
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_FROM_SEARCH_VALUE', this.endTimeFromComputed);
            },
            clearEndDateTo() {
                this.endTimeTo = null;
                this.endDateTo = null;
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_TO_SEARCH_VALUE', this.endTimeToComputed);
            },
            saveEndDateTo() {
                this.$refs.endDateToDialog.save(this.endDateTo);
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_TO_SEARCH_VALUE', this.endTimeToComputed);
            },
            clearEndTimeTo() {
                this.endTimeTo = null;
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_TO_SEARCH_VALUE', this.endTimeToComputed);
            },
            saveEndTimeTo() {
                this.$refs.endTimeToDialog.save(this.endTimeTo);
                this.$store.commit('DOCUMENT_STORE/SET_END_TIME_TO_SEARCH_VALUE', this.endTimeToComputed);
            },
        }
    }
</script>

<style scoped>

</style>