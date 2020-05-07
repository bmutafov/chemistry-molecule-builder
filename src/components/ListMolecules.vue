<template>
    <div>
        <li v-for="molecule in molecules" :key="molecule.formula">
            {{ molecule.name }} ( {{ molecule.formula }})
        </li>
        <GameLevel v-bind:onSubmit="submit" elementsLink="/api/element" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameLevel from "./GameLevel.vue";

export default Vue.extend({
    name: "ListMolecules",
    components: {
        GameLevel
    },
    data() {
        return {
            molecules: []
        };
    },
    methods: {
        submit(data) {},
        loggedInCookie() {
            return this.$cookies.get("auth-token") || false;
        },
        async retrieveData() {
            if (!this.loggedInCookie()) return false;

            const result = await this.$http.get(`${this.$url}/api/molecule`, {
                headers: { "auth-token": this.$cookies.get("auth-token") }
            });
            if (result.status >= 400) return false;

            const data = {
                molecules: result.data.data
            };
            return data;
        }
    },
    async beforeMount() {
        const data = await this.retrieveData();
        if (!data) {
            this.$router.push("/login");
            return;
        }
        console.log(data);
        this.molecules = data.molecules;
    }
});
</script>

<style scoped></style>
