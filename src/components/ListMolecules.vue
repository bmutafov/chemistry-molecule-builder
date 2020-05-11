<template>
    <div>
        <div class="inputs">
            <InputField
                label="Molecule name"
                type="text"
                name="name"
                placeholder=""
                v-model="name"
                class="mrt-1"
            />
            <InputField
                label="Formula"
                type="text"
                name="formula"
                placeholder=""
                v-model="formula"
                class="mrt-1"
            />
        </div>
        <GameLevel
            class="mrt-1 game-level"
            v-bind:onSubmit="submit"
            elementsLink="/api/element"
        />
        <h3>Existing molecules</h3>

        <ul class="existing">
            <li v-for="molecule in molecules" :key="molecule.formula">
                <b>{{ molecule.name }}</b> ( {{ molecule.formula }} )
                <img
                    src="https://img.icons8.com/flat_round/16/000000/delete-sign.png"
                    v-on:click="remove(molecule._id)"
                    class="remove-butt"
                />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import InputField from "./InputField.vue";
import GameLevel from "./GameLevel.vue";
import parseGraph from "../utils/graph-parser";

export default Vue.extend({
    name: "ListMolecules",
    components: {
        GameLevel,
        InputField
    },
    data() {
        return {
            molecules: [],
            name: "",
            formula: ""
        };
    },
    methods: {
        async remove(id) {
            const result = await this.$http.delete(
                `${this.$url}/api/molecule/${id}`,
                {
                    headers: { "auth-token": this.$cookies.get("auth-token") }
                }
            );

            if (result.status >= 400) console.error("erorr", result);
            else this.molecules = this.molecules.filter(m => m._id !== id);
        },
        async submit(data) {
            const parsedGraph = parseGraph(data);

            const result = await this.$http.post(
                `${this.$url}/api/molecule`,
                {
                    name: this.name,
                    formula: this.formula,
                    solution: parsedGraph
                },
                {
                    headers: { "auth-token": this.$cookies.get("auth-token") }
                }
            );
            if (result.status >= 400) return false;

            const newData = await this.retrieveData();
            console.log(newData);
            if (newData) this.molecules = newData.molecules;
        },
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

<style scoped>
.mrt-1 {
    margin-top: 10px;
}

.inputs {
    width: 300px;
    margin: 0 auto;
}

.game-level {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.existing {
    width: 100%;
    display: flex;
    flex-direction: row;
    list-style-type: none;
}

.existing li {
    background: #ffffff;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 2px 2px #cfcfcf;
    margin-left: 5px;
    display: flex;
    align-items: center;
}

.remove-butt {
    cursor: pointer;
    margin-left: 5px;
}
</style>
