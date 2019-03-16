<template>
    <div>
        <!--<TaskSearch></TaskSearch>-->
        <!--<br>-->
        <!--<br>-->
        <!--<ExecutorTaskTable v-if="isStaff || isManager"></ExecutorTaskTable>-->
        <!--<br>-->
        <div class="elevation-1">

            <v-expansion-panel focusable class="elevation-0">
                <v-expansion-panel-content>
                    <template slot="header">
                        <div>Item</div>
                    </template>
                    <v-card>
                        <v-card-text>
                            <v-text-field
                                    class="mx-3"
                                    label="Search"
                                    prepend-inner-icon="search"
                            ></v-text-field>
                        </v-card-text>
                    </v-card>
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
            </v-tabs-items>
        </div>
    </div>
</template>

<script>
    import TaskTable from '@/components/tasks/TaskTable.vue';
    import TaskSearch from '@/components/tasks/TaskSearch.vue';
    import {mapGetters} from 'vuex';

    export default {
        name: "TaskPage",
        components: {TaskSearch, CreatorTaskTable: TaskTable},
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