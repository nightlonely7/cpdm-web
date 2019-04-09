<template>
    <div class="elevation-5">
        <v-toolbar  tabs fixed-tabs class="elevation-0">
            <v-toolbar-title>PHẢN HỒI YÊU CẦU THÔNG TIn CHỈ ĐẠO</v-toolbar-title>
            <template slot="extension">
                <v-tabs
                        v-model="tags"
                        centered
                        slider-color="primary"
                        color="transparent"
                >
                    <v-tab @click="refreshWaiting=!refreshWaiting">
                        YÊU CẦU ĐANG CHỜ
                    </v-tab>
                    <v-tab @click="refreshRelied=!refreshRelied">
                        YÊU CẦU ĐÃ PHẢN HỒI
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
        <v-tabs-items v-model="tags">
            <v-tab-item>
                <ReceiverAskingRequestTable type="waiting" :refreshFlag="refreshWaiting"></ReceiverAskingRequestTable>
            </v-tab-item>
            <v-tab-item>
                <ReceiverAskingRequestTable type="replied" :refreshFlag="refreshRelied"></ReceiverAskingRequestTable>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    import ReceiverAskingRequestTable from "../../components/askingRequests/ReceiverAskingRequestTable";

    export default {
        name: "ReceiverAskingRequestPage",
        components: {ReceiverAskingRequestTable},
        data() {
            return {
                tags: null,
                refreshWaiting: false,
                refreshRelied: false,
            }
        }
    }
</script>

<style scoped>

</style>