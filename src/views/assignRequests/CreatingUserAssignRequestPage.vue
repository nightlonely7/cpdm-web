<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div class="elevation-1">
        <v-toolbar flat color="white">
            <v-toolbar-title class="animated bounce delay-1s">THEO DÕI TÁC VỤ ỦY QUYỀN</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-btn color="primary" @click="refresh">
                <v-icon left>cached</v-icon>
                <span>Làm mới</span>
            </v-btn>
            <v-menu
                    v-model="fromDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                            v-model="fromDate"
                            label="Ngày bắt đầu"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="fromDate"
                               :min="minDate"
                               :max="maxDate"
                               @input="fromDateMenu = false"></v-date-picker>
            </v-menu>
            <v-menu
                    v-model="toDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
            >
                <template v-slot:activator="{ on }">
                    <v-text-field
                            v-model="toDate"
                            label="Ngày kết thúc"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="toDate"
                               :min="fromDate"
                               :max="maxDate"
                               @input="toDateMenu = false"></v-date-picker>
            </v-menu>
        </v-toolbar>
        <TaskTableForAssign title="TÁC VỤ PHỤ TRÁCH" getTasksURL="search/executes/notAssigned"
                            :isAssigned="false" :refreshFlag="refreshFlag"
                            :fromDate="fromDate" :toDate="toDate" @refresh="refresh"></TaskTableForAssign>
        <br/>
        <TaskTableForAssign title="ĐÃ ỦY QUYỀN HOÀN TOÀN" getTasksURL="search/executes/fullAssigned"
                            :isAssigned="true" :refreshFlag="refreshFlag"
                            :fromDate="fromDate" :toDate="toDate"></TaskTableForAssign>
        <br/>
        <TaskTableForAssign title="ĐÃ ỦY QUYỀN MỘT PHẦN" getTasksURL="search/executes/partAssigned"
                            :isAssigned="true" :refreshFlag="refreshFlag"
                            :fromDate="fromDate" :toDate="toDate"></TaskTableForAssign>
    </div>
</template>

<script>
    import TaskTableForAssign from "@/components/tasks/TaskTableForAssign";
    import moment from 'moment';

    export default {
        name: "CreatingUserAssignRequestPage",
        components: {TaskTableForAssign},
        data() {
            return {
                minDate: moment(new Date()).toISOString().substr(0, 10),
                maxDate: moment(new Date().get).add(365, 'days').toISOString().substr(0, 10),
                fromDateMenu: false,
                toDateMenu: false,
                fromDate: new Date().toISOString().substr(0, 10),
                toDate: moment(this.fromDate).add(6, 'days').toISOString().substr(0, 10),
                refreshFlag: false,
            }
        },
        methods : {
            refresh: function () {
                this.refreshFlag = !this.refreshFlag;
            }
        }
    }
</script>

<style scoped>

</style>