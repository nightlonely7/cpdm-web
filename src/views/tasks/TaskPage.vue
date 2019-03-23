<template>
    <div>

        <div class="elevation-1">
            <v-expansion-panel focusable class="elevation-0">
                <v-expansion-panel-content>
                    <template slot="header">
                        <div>Tìm kiếm</div>
                    </template>
                    <TaskSearch></TaskSearch>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-toolbar tabs fixed-tabs class="elevation-0">
                <v-toolbar-title>QUẢN LÝ TÁC VỤ</v-toolbar-title>

                <template slot="extension">
                    <v-tabs
                            v-model="tabs"
                            centered
                            slider-color="primary"
                            color="transparent"
                    >
                        <v-tab v-if="isStaff || isManager">
                            TÁC VỤ ĐƯỢC GIAO
                        </v-tab>
                        <v-tab v-if="isAdmin || isManager">
                            TÁC VỤ ĐÃ GIAO
                        </v-tab>
                        <v-tab>
                            TÁC VỤ LIÊN QUAN
                        </v-tab>
                        <v-tab>
                            DANH SÁCH PHÒNG BAN
                        </v-tab>
                    </v-tabs>
                </template>
            </v-toolbar>

            <v-tabs-items v-model="tabs">
                <v-tab-item v-if="!isAdmin">
                    <CreatorTaskTable type="executor"></CreatorTaskTable>
                </v-tab-item>
                <v-tab-item v-if="!isStaff">
                    <CreatorTaskTable type="creator"></CreatorTaskTable>
                </v-tab-item>
                <v-tab-item>
                    <CreatorTaskTable type="related"></CreatorTaskTable>
                </v-tab-item>
                <v-tab-item>
                    <DepartmentTable></DepartmentTable>
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
    import TaskTable from '@/components/tasks/TaskTable.vue';
    import TaskSearch from '@/components/tasks/TaskSearch.vue';
    import {mapGetters} from 'vuex';
    import DepartmentTable from "../../components/departments/DepartmentTable";

    export default {
        name: "TaskPage",
        components: {TaskSearch, CreatorTaskTable: TaskTable, DepartmentTable: DepartmentTable},
        data() {
            return {
                tabs: null,
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            })
        }
    }
</script>

<style scoped>

</style>