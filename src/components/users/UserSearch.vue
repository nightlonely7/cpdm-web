<template>
    <div>
        <v-card>
            <v-card-text>
                <v-text-field v-model="emailSearchValue"
                              label="Tìm theo email"
                              clearable
                              @input="getSearchValue"
                ></v-text-field>
                <v-text-field v-model="displayNameSearchValue"
                              label="Tìm theo tên hiển thị"
                              clearable
                              @input="getSearchValue"
                ></v-text-field>
                <v-text-field v-model="fullNameSearchValue"
                              label="Tìm theo tên đầy đủ"
                              clearable
                              @input="getSearchValue"
                ></v-text-field>
                <v-range-slider label="Tìm theo tuổi" v-model="age" :max="maxAge" :min="minAge"
                                @change="getSearchUserAge"></v-range-slider>
                <v-input>Từ: {{age[0]}}</v-input>
                <v-input>Đến: {{age[1]}}</v-input>
                <v-radio-group v-model="gender">
                    <v-radio label="Cả hai" value="null" color="blue"></v-radio>
                    <v-radio label="Nam" value="true" color="blue"></v-radio>
                    <v-radio label="Nữ" value="false" color="blue"></v-radio>
                </v-radio-group>
                <v-select :items="departments" item-text="name" v-model="selectedDepartment"
                          :item-value="department => department.id" label="Danh sách phòng ban">
                </v-select>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
    import 'vuex';
    import axios from 'axios';
    import _ from 'lodash';
    import 'moment';

    export default {
        name: "UserSearch",
        data() {
            return {
                gender: 'null',
                selectedDepartment: 1,
                age: [18, 60],
                minAge: 18,
                maxAge: 80,
                searchEmailDepartment: [],
                searchDisplayNameDepartment: [],
                searchFullNameDepartment: [],
                departments: [],
            }
        },
        computed: {
            emailSearchValue: {
                get() {
                    return this.$store.state.USER_STORE.emailSearchValue
                },
                set(val) {
                    this.$store.commit('USER_STORE/SET_EMAIL_SEARCH_VALUE', val)
                }
            },
            displayNameSearchValue: {
                get() {
                    return this.$store.state.USER_STORE.displayNameSearchValue
                },
                set(val) {
                    this.$store.commit('USER_STORE/SET_DISPLAY_NAME_SEARCH_VALUE', val)
                }
            },
            fullNameSearchValue: {
                get() {
                    return this.$store.state.USER_STORE.fullNameSearchValue
                },
                set(val) {
                    this.$store.commit('USER_STORE/SET_FULL_NAME_SEARCH_VALUE', val)
                }
            },
        },
        mounted(){
            this.getMaxMinAge();
            this.getDepartments();
        },
        methods: {
            getSearchValue: function () {
                this.getSearchUser('email');
                this.getSearchUser('displayName');
                this.getSearchUser('fullName');
                const resultList = [this.searchEmailDepartment,
                    this.searchFullNameDepartment, this.searchDisplayNameDepartment];
                const result = _.intersectionBy(...resultList, "id");
                this.$store.commit("USER_STORE/SET_USERS", result);
            },
            getSearchUser: function (searchTarget) {
                const url = 'http://localhost:8080/users/search/' + searchTarget;
                let searchValue = '';
                switch (searchTarget) {
                    case "email":
                        searchValue = this.emailSearchValue === null ? '' : this.emailSearchValue;
                        break;
                    case 'displayName':
                        searchValue = this.displayNameSearchValue === null ? '' : this.displayNameSearchValue;
                        break;
                    case "fullName":
                        searchValue = this.fullNameSearchValue === null ? '' : this.fullNameSearchValue;
                        break;
                }
                axios.get(url, {
                    params: {
                        searchValue: searchValue,
                        departmentId: this.selectedDepartment,
                        gender: this.gender
                    }
                })
                    .then(
                        response => {
                            switch (searchTarget) {
                                case "email":
                                    this.searchEmailDepartment = response.data.content;
                                    break;
                                case 'displayName':
                                    this.searchDisplayNameDepartment = response.data.content;
                                    break;
                                case "fullName":
                                    this.searchFullNameDepartment = response.data.content;
                                    break;
                            }
                        }
                    )
                    .catch(
                        err => {
                            console.log(err)
                        }
                    )
            },
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
                const birthDateFrom = this.moment().year() - this.age[1];
                const birthDateTo = this.moment().year() - this.age[0];
                console.log(this.moment().year(birthDateFrom).format("YYYY-MM-DD").toString());
                console.log(this.moment().year(birthDateTo).format("YYYY-MM-DD").toString());
                axios.get('http://localhost:8080/users/search/age', {
                    params: {
                        birthDateFrom: this.moment().year(birthDateFrom).format("YYYY-MM-DD").toString(),
                        birthDateTo: this.moment().year(birthDateTo).format("YYYY-MM-DD").toString(),
                        gender: this.gender
                    }
                })
                    .then(
                        response => {
                            this.$store.commit("USER_STORE/SET_USERS", response.data.content);
                            console.log(this.departments);
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    )
            },
            getMaxMinAge: function () {
                axios.get('http://localhost:8080/users/search/maxMinAge')
                    .then(
                        response => {
                            const ageList = response.data;
                            this.minAge = this.moment().year() - ageList[1].birthday.split("-")[0];
                            this.maxAge = this.moment().year() - ageList[0].birthday.split("-")[0];
                            if(this.minAge < 18){
                                this.minAge = 18;
                            }
                            if(this.maxAge > 80){
                                this.maxAge = 80;
                            }
                            this.age = [this.minAge, this.maxAge];
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
            this.debouncedGetSearchUser = _.debounce(this.getSearchUser, 500);
            this.debouncedGetSearchValue = _.debounce(this.getSearchValue, 500);
            this.debouncedGetSearchUserAge = _.debounce(this.getSearchUserAge, 500);
        }
    }
</script>

<style scoped>

</style>