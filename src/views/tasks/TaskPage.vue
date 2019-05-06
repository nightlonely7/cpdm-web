<template>
    <div>

        <TaskSearch></TaskSearch>
        <v-divider></v-divider>
        <v-toolbar tabs fixed-tabs class="elevation-1">
            <v-toolbar-title>QUẢN LÝ TÁC VỤ</v-toolbar-title>
            <template slot="extension">
                <v-tabs
                        v-model="tabs"
                        slider-color="primary"
                        color="transparent"
                >
                    <v-tab v-if="isStaff || isManager">
                        <v-icon color="primary">mdi-arrow-collapse-down</v-icon>&nbsp;TÁC VỤ ĐƯỢC NHẬN
                    </v-tab>
                    <v-tab v-if="isAdmin || isManager">
                        <v-icon color="primary">mdi-share</v-icon>&nbsp;TÁC VỤ ĐÃ GIAO
                    </v-tab>
                    <v-tab v-if="isManager || isStaff">
                        <v-icon color="primary">mdi-eye</v-icon>&nbsp;TÁC VỤ THEO DÕI
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>

        <v-divider></v-divider>
        <v-tabs-items v-model="tabs">
            <v-tab-item v-if="isManager || isStaff">
                <TaskTable title="TÁC VỤ ĐƯỢC NHẬN" getTasksURL="search/executes"></TaskTable>
            </v-tab-item>
            <v-tab-item v-if="isManager || isAdmin">
                <TaskTable title="TÁC VỤ ĐÃ GIAO" getTasksURL="search/creates"></TaskTable>
            </v-tab-item>
            <v-tab-item v-if="isManager || isStaff">
                <TaskTable title="TÁC VỤ THEO DÕI" getTasksURL="search/relatives"></TaskTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    import TaskTable from '@/components/tasks/TaskTable.vue';
    import TaskSearch from '@/components/tasks/TaskSearch.vue';
    import {mapGetters} from 'vuex';

    export default {
        name: "TaskPage",
        components: {TaskSearch, TaskTable},
        data() {
            return {
                tabs: 0,
            }
        },
        computed: {
            ...mapGetters('AUTHENTICATION', {
                isAdmin: 'isAdmin',
                isManager: 'isManager',
                isStaff: 'isStaff',
            })
        },
        mounted() {
            this.$emit("refresh");
        }
    }
</script>

<style scoped>

</style>