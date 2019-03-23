<template>
    <div>
        <p style="color: blue">Tên phòng ban: {{department.name || 'Chưa xác định'}}</p>
        <p style="color: blue">Mã phòng ban: {{department.alias || 'Chưa xác định'}}</p>
        <v-btn @click="showForm" color="primary">Sửa</v-btn>
        <v-btn @click="deleteDepartment" color="error">Xóa</v-btn>
        <br>
        <DepartmentForm></DepartmentForm>
    </div>
</template>

<script>
    import axios from 'axios';
    import DepartmentForm from "./DepartmentForm";
    import {mapState} from 'vuex';

    export default {
        name: "DepartmentDetail",
        components: {DepartmentForm},
        data(){
            return {
                department: {}
            }
        },
        props: {
            id: Number
        },
        mounted() {
            this.getDepartmentDetail(this.id);
            this.$store.commit('DEPARTMENT_STORE/SET_SHOW_FORM', false);
        },
        methods: {
            getDepartmentDetail: async function (id) {
                await axios.get(`http://localhost:8080/departments/${id}`)
                    .then(
                        response => {
                             this.department = response.data;
                        }
                    )
                    .catch(
                        err => {
                            console.log(err);
                        }
                    );
            },
            showForm: function () {
                this.$store.commit('DEPARTMENT_STORE/SET_SHOW_FORM', true);
                this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_FORM', this.department);
            },
            deleteDepartment: function () {
                if (confirm('Xóa?')) {
                    const department = {...this.department};
                    department.isAvailable = false;
                    axios.patch(`http://localhost:8080/departments/${department.id}`, {})
                        .then(
                            response => {
                                this.department = response.data;
                                this.$router.push("/tasks");
                                console.log(this.department);
                            }
                        )
                }
            }
        },
    }
</script>

<style scoped>

</style>
