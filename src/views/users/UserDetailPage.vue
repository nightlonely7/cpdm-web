<template>
    <div>
        <v-btn @click="goBack" color="primary">Trở về</v-btn>
        <br>
        <br>
        <UserDetail :id="id"></UserDetail>
    </div>
</template>

<script>
    import UserDetail from "@/components/users/UserDetail";

    export default {
        name: "UserDetailPage",
        components: {UserDetail},
        data() {
            return {
                id: 0,
            }
        },
        methods: {
            goBack: function () {
                this.$router.push("/users");
            }
        },
        mounted() {
            this.id = Number.parseInt(this.$route.params.id);
        },

    }
</script>

<style scoped>

</style>