<template>
    <div>
        <v-card>
            <v-card-text>
                <v-form ref="form">
                    <v-text-field v-model="emailSearchValue"
                                  label="Tìm theo email"
                                  :rules="emailSearchRules"
                                  validation-on-blur
                                  clearable
                    ></v-text-field>
                    <v-text-field v-model="displayNameSearchValue"
                                  label="Tìm theo tên hiển thị"
                                  :rules="displayNameSearchRules"
                                  validation-on-blur
                                  clearable
                    ></v-text-field>
                    <v-text-field v-model="fullNameSearchValue"
                                  label="Tìm theo tên đầy đủ"
                                  :rules="fullNameSearchRules"
                                  validation-on-blur
                                  clearable
                    ></v-text-field>
                    <br/>
                    <v-range-slider label="Tìm theo tuổi" v-model="age" :max="maxAge" :min="minAge"
                                    persistence-hint thumb-label="always" @change="getSearchUserAge">
                    </v-range-slider>
                    <v-radio-group v-model="gender" label="Giới tính">
                        <v-radio label="Cả hai" value="null" color="blue"></v-radio>
                        <v-radio label="Nam" value="true" color="blue"></v-radio>
                        <v-radio label="Nữ" value="false" color="blue"></v-radio>
                    </v-radio-group>
                    <v-select :items="departments" item-text="name" v-model="departmentId"
                              :item-value="department => department.id" label="Danh sách phòng ban"
                              validate-on-blur
                    ></v-select>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import 'moment';
    import {mapState} from 'vuex';

    export default {
        name: "UserSearch",
        data() {
            return {
                age: [18, 60],
                minAge: 18,
                maxAge: 80,
                searchEmailDepartment: [],
                searchDisplayNameDepartment: [],
                searchFullNameDepartment: [],
                departments: [],
                dayFrom: 1,
                dayTo: 1,
                monthFrom: 1,
                monthTo: 1,
                yearFrom: 1990,
                yearTo: 2018,
                charRegex: /^[a-zA-Z_.-]*$/,
                charNumberRegex: /^[a-zA-Z0-9_.-]*$/,
                emailRegex: /^[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]+$/,
                // specialCharRegex: "!@#$^&%*()+=-[]/{}|:<>?,.",
                emailSearchRules: [
                    val => (val !== null && (val === '' || (val.match(this.emailRegex) !== null)))
                        || "Sai định dạng email!"
                ],
                displayNameSearchRules: [
                    val => (val !== null && (val === '' || (val.match(this.charNumberRegex) !== null)))
                        || "Chỉ được điền kí tự chữ cái và chữ số, không được điền các dấu câu hay kí tự khác!"
                ],
                fullNameSearchRules: [
                    val => (val !== null && (val === '' || (val.match(this.charRegex) !== null)))
                        || "Chỉ được điền kí tự chữ cái và chữ số, không được điền các dấu câu hay kí tự khác!"
                ],
            }
        },
        computed: {
            emailSearchValue: {
                get() {
                    return this.$store.state.USER_STORE.emailSearchValue;
                },
                set(value) {
                    // this.$store.commit('USER_STORE/SET_DISPLAY_NAME_SEARCH_VALUE', value === null ? '' : value);
                    if (value !== null) {
                        if (value === '' || value.match(this.emailRegex)) {
                            this.$store.commit('USER_STORE/SET_EMAIL_SEARCH_VALUE', value);
                        }
                    } else {
                        this.$store.commit('USER_STORE/SET_EMAIL_SEARCH_VALUE', '');
                        this.$refs.form.resetValidation();
                    }
                }
            },
            displayNameSearchValue: {
                get() {
                    return this.$store.state.USER_STORE.displayNameSearchValue;
                },
                set(value) {
                    // this.$store.commit('USER_STORE/SET_DISPLAY_NAME_SEARCH_VALUE', value === null ? '' : value);
                    if (value !== null) {
                        if (value === '' || value.match(this.charNumberRegex)) {
                            this.$store.commit('USER_STORE/SET_DISPLAY_NAME_SEARCH_VALUE', value);
                        }
                    } else {
                        this.$store.commit('USER_STORE/SET_DISPLAY_NAME_SEARCH_VALUE', '');
                        this.$refs.form.resetValidation();
                    }
                }
            },
            fullNameSearchValue: {
                get() {
                    return this.$store.state.USER_STORE.fullNameSearchValue;
                },
                set(value) {
                    // this.$store.commit('USER_STORE/SET_FULL_NAME_SEARCH_VALUE', value === null ? '' : value);
                    if (value !== null) {
                        if (value === '' || value.match(this.charRegex)) {
                            this.$store.commit('USER_STORE/SET_FULL_NAME_SEARCH_VALUE', value);
                        }
                    } else {
                        this.$refs.form.resetValidation();
                        this.$store.commit('USER_STORE/SET_FULL_NAME_SEARCH_VALUE', '');
                    }
                }
            },
            departmentId: {
                get() {
                    return this.$store.state.USER_STORE.departmentId;
                },
                set(value) {
                    this.$store.commit('USER_STORE/SET_DEPARTMENT_ID_VALUE', value)
                }
            },
            birthDateTo: {
                get() {
                    return this.$store.state.USER_STORE.birthDateTo;
                },
                set(value) {
                    this.$store.commit('USER_STORE/SET_BIRTH_DATE_TO_VALUE', value)
                }
            },
            birthDateFrom: {
                get() {
                    return this.$store.state.USER_STORE.birthDateFrom;
                },
                set(value) {
                    this.$store.commit('USER_STORE/SET_BIRTH_DATE_FROM_VALUE', value)
                }
            },
            gender: {
                get() {
                    return this.$store.state.USER_STORE.gender;
                },
                set(value) {
                    this.$store.commit('USER_STORE/SET_GENDER_VALUE', value)
                }
            }
        },
        mounted() {
            this.getMaxMinAge();
            this.getDepartments();
            this.getSearchUserAge();
            this.departmentId = 1;
            this.gender = "null";
        },
        methods: {
            getDepartments: function () {
                axios.get('http://localhost:8080/departments')
                    .then(
                        response => {
                            this.departments = response.data.content;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            },
            getSearchUserAge: function () {
                if(this.age[1] === this.minAge){
                    this.birthDateFrom = this.moment().year(this.yearFrom).month(this.monthFrom - 1).date(this.dayFrom)
                        .format("YYYY-MM-DD").toString();
                }
                if(this.age[0] === this.maxAge){
                    this.birthDateTo = this.moment().year(this.yearTo).month(this.monthTo - 1).date(this.dayTo)
                        .format("YYYY-MM-DD").toString();
                }
                if(this.age[1] !== this.minAge && this.age[0] !== this.maxAge){
                    const dateFrom = this.moment().year() - this.age[1];
                    const dateTo = this.moment().year() - this.age[0];
                    this.birthDateFrom = this.moment().year(dateFrom).month(this.monthFrom - 1).date(this.dayFrom)
                        .format("YYYY-MM-DD").toString();
                    this.birthDateTo = this.moment().year(dateTo).month(this.monthTo - 1).date(this.dayTo)
                        .format("YYYY-MM-DD").toString();
                }
                console.log(this.birthDateFrom + "-" + this.birthDateTo);
            },
            getMaxMinAge: function () {
                axios.get('http://localhost:8080/users/search/maxMinAge')
                    .then(
                        response => {
                            const ageList = response.data;
                            this.minAge = this.moment().year() - ageList[1].birthday.split("-")[0];
                            this.maxAge = this.moment().year() - ageList[0].birthday.split("-")[0];
                            this.age = [this.minAge, this.maxAge];
                            this.dayFrom = Number.parseInt(ageList[1].birthday.split("-")[2]);
                            this.dayTo = Number.parseInt(ageList[0].birthday.split("-")[2]);
                            this.monthFrom = Number.parseInt(ageList[1].birthday.split("-")[1]);
                            this.monthTo = Number.parseInt(ageList[0].birthday.split("-")[1]);
                            this.yearFrom = Number.parseInt(ageList[1].birthday.split("-")[0]);
                            this.yearTo = Number.parseInt(ageList[0].birthday.split("-")[0]);
                            console.log(this.age.toString());
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            }
        },
        created() {

        }
    }
</script>

<style scoped>

</style>