<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br/><br/>
        <p style="color: blue">Tên phòng ban: {{department.name || 'Chưa xác định'}}</p>
        <p style="color: blue">Mã phòng ban: {{department.alias || 'Chưa xác định'}}</p>
        <v-list>

        </v-list>
        <DepartmentForm>
            <template #activator="{on}">
                <v-btn v-on="on" color="primary">Sửa</v-btn>
            </template>
        </DepartmentForm>
        <v-btn @click="deleteDepartment" color="error">Xóa</v-btn>
        <br/>
    </div>
</template>

<script>
    import axios from 'axios';
    import DepartmentForm from "./DepartmentForm";

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
            deleteDepartment: function () {
                if (confirm('Xóa?')) {
                    const department = {...this.department};
                    department.isAvailable = false;
                    axios.patch(`http://localhost:8080/departments/${department.id}`, {})
                        .then(
                            response => {
                                this.department = response.data;
                                console.log(this.department);
                                this.$store.commit('DEPARTMENT_STORE/SET_IS_EDIT', false);
                                this.$store.commit('DEPARTMENT_STORE/SET_DEPARTMENT_NAME', '');
                                this.$router.push("/departments");
                            }
                        )
                }
            },
            goBack: function () {
                this.$router.push('/departments');
            }
        },
    }
</script>

<style scoped>

</style>
