<template>
    <div>
        <li v-for="molecule in molecules" :key="molecule.formula">
            {{ molecule.name }} ( {{ molecule.formula }})
        </li>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: 'ListMolecules',
    data() {
        return {
            molecules: [],
        };
    },
    methods: {
        loggedInCookie() {
            return this.$cookies.get('auth-token') || false;
        },
        async retrieveData() {
            if (!this.loggedInCookie()) return false;

            const result = await this.$http.get(`${this.$url}/api/molecule`, {
                headers: { 'auth-token': this.$cookies.get('auth-token') },
            });
            if (result.status >= 400) return false;

            const data = result.data.data;
            return data;
        },
    },
    async beforeMount() {
        const data = await this.retrieveData();
        if (!data) {
            this.$router.push('/login');
            return;
        }
        console.log(data);
        this.molecules = data;
    },
});
</script>

<style scoped></style>
