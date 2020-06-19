<template>
    <div style="height: 100%">
        <Navigation />
        <div class="boxes">
            <div class="box">
                <h3>Add molecule</h3>
                <div class="inputs">
                    <InputField label="Molecule name" type="text" name="name" placeholder="" v-model="name" class="mrt-1" />
                    <InputField label="Formula" type="text" name="formula" placeholder="" v-model="formula" class="mrt-1" />
                </div>
                <Button @click.native="submit" class="mrt-1"> Add molecule </Button>
            </div>

            <div class="box">
                <h3>Existing molecules</h3>

                <ul class="existing">
                    <li v-for="molecule in molecules" :key="molecule.formula">
                        <span>
                            <b>{{ molecule.name }}</b> ( {{ molecule.formula }} )
                        </span>
                        <img src="https://img.icons8.com/flat_round/25/000000/delete-sign.png" v-on:click="remove(molecule._id)" class="remove-butt" />
                    </li>
                </ul>
            </div>
        </div>
        <GameLevelCreator :name="name" :formula="formula" ref="gameLevelCreator" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import InputField from './InputField.vue';
import Navigation from './Navigation.vue';
import GameLevelCreator from './GameLevelCreator.vue';
import Button from './Button.vue';

export default Vue.extend({
    name: 'ListMolecules',
    components: {
        // GameLevel,
        InputField,
        Navigation,
        GameLevelCreator,
        Button,
    },
    data() {
        return {
            molecules: [],
            name: '',
            formula: '',
        };
    },
    methods: {
        async remove(id) {
            const result = await this.$http.delete(`${this.$url}/api/molecule/${id}`, {
                headers: { 'auth-token': this.$cookies.get('auth-token') },
            });

            if (result.status >= 400) console.error('erorr', result);
            else this.molecules = this.molecules.filter(m => m._id !== id);
        },
        async submit() {
            const parsedGraph = this.$refs.gameLevelCreator.getSolution();

            const result = await this.$http.post(
                `${this.$url}/api/molecule`,
                {
                    name: this.name,
                    formula: this.formula,
                    solution: parsedGraph,
                },
                {
                    headers: { 'auth-token': this.$cookies.get('auth-token') },
                }
            );
            if (result.status >= 400) return false;

            const newData = await this.retrieveData();
            console.log(newData);
            if (newData) this.molecules = newData.molecules;
        },
        loggedInCookie() {
            return this.$cookies.get('auth-token') || false;
        },
        async retrieveData() {
            if (!this.loggedInCookie()) return false;

            const result = await this.$http.get(`${this.$url}/api/molecule`, {
                headers: { 'auth-token': this.$cookies.get('auth-token') },
            });
            if (result.status >= 400) return false;

            const data = {
                molecules: result.data.data,
            };
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
        this.molecules = data.molecules;
    },
});
</script>

<style scoped>
.mrt-1 {
    margin-top: 10px;
}

.existing {
    width: 100%;
    display: flex;
    flex-direction: column;
    list-style-type: none;
    padding: 0;
}

.existing li {
    background: #ffffff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 2px 2px #cfcfcf;
    margin-left: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
}

.remove-butt {
    cursor: pointer;
    margin-left: 5px;
}

.remove-butt:hover {
    filter: contrast(200%);
}

.boxes {
    display: flex;
    flex-direction: row;
    width: 1100px;
    margin: 20px auto;
}

.box {
    background: rgb(243, 243, 243);
    width: 500px;
    margin: 0 auto;
    box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.2);
    padding: 10px;
    border-radius: 15px;
}
</style>
