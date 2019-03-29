<template>
    <div>
        <v-expansion-panel focusable class="elevation-0">
            <v-expansion-panel-content>
                <template slot="header">
                    <div>Tìm kiếm</div>
                </template>
                <DepartmentSearch></DepartmentSearch>
            </v-expansion-panel-content>
        </v-expansion-panel>
        <DepartmentTable></DepartmentTable>
    </div>
</template>

<script>
    import DepartmentTable from "../../components/departments/DepartmentTable";
    import DepartmentSearch from "../../components/departments/DepartmentSearch";

    export default {
        name: "DepartmentPage",
        components: {DepartmentTable, DepartmentSearch}
    }
</script>

<style scoped>

</style>