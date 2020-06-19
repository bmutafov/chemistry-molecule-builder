<template>
    <div class="page">
        <div class="col">
            <h3 class="fancy">Navigate</h3>
            <Navigation />
            <h3 class="fancy">Existing molecules</h3>
            <ul>
                <li v-for="molecule in molecules" :key="molecule.formula">
                    <img src="https://image.flaticon.com/icons/png/512/883/883026.png" />
                    <span class="text-el">
                        <span>
                            {{ molecule.formula }}<b>{{ molecule.name }}</b>
                        </span>
                        <img src="https://img.icons8.com/flat_round/25/000000/delete-sign.png" v-on:click="remove(molecule._id)" class="remove-butt" />
                    </span>
                </li>
            </ul>
        </div>
        <div class="col-2">
            <h3 class="fancy">Add molecule</h3>
            <div class="inputs">
                <InputField label="Molecule name" type="text" name="name" placeholder="" v-model="name" class="mrt-1" />
                <InputField label="Formula" type="text" name="formula" placeholder="" v-model="formula" class="mrt-1" />
            </div>
            <GameLevelCreator :name="name" :formula="formula" ref="gameLevelCreator" />
            <RoughButton @click.native="submit" class="mrt-1" type="success"> Add molecule </RoughButton>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import InputField from './InputField.vue';
import Navigation from './Navigation.vue';
import GameLevelCreator from './GameLevelCreator.vue';
import RoughButton from './RoughButton.vue';

export default Vue.extend({
    name: 'ListMolecules',
    components: {
        // GameLevel,
        InputField,
        Navigation,
        GameLevelCreator,
        RoughButton,
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

.col ul li:hover .remove-butt {
    filter: grayscale(0);
    opacity: 1;
}

.text-el {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.text-el .text {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.remove-butt {
    filter: grayscale(100);
    cursor: pointer;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    transition: 0.2 ease-in-out;
}

.remove-butt:hover {
    transform: scale(1.1);
}

.element-preview {
    margin: 50px auto;
}

.text-el {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}
</style>
