<template>
    <div v-bind:style="`background: ${color}`">
        <!-- <div v-if="allMolecules" class="flex-row">
            <div v-for="molecule in allMolecules" :key="molecule.formula">
                <div class="element-link">
                    <router-link :to="`/game/${molecule.formula}`">{{
                        molecule.formula
                    }}</router-link>
                </div>
            </div>
        </div> -->
        <div class="answer">
            Your last answer was:
            <span class="emphasize">{{ correctText }}</span>
        </div>
        <div v-if="loading">Loading...</div>
        <div v-if="name">
            <div class="instructions">
                <h3 class="fancy">
                    Compose the molecule of {{ name }} ({{ formula }}).
                </h3>
                <h5 class="fancy">
                    to connect elements hold
                    <span class="text-highlight">⇧ shift</span> and drag
                </h5>
            </div>

            <GameLevel
                v-bind:onSubmit="submit"
                v-bind:elementsLink="`/api/molecule/elements/${this.formula}`"
                v-bind:color="color"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import GameLevel from "./GameLevel.vue";
import parseGraph from "../utils/graph-parser";

export default Vue.extend({
    name: "Game",
    components: {
        GameLevel
    },
    data() {
        return {
            allMolecules: null,
            loading: false,
            name: null,
            formula: null,
            color: "#68b8e3",
            correctText: "no answer yet"
        };
    },
    watch: {
        $route: "fetchData"
    },
    methods: {
        async submit(data) {
            const parsedData = parseGraph(data);

            const result = await this.$http.post(
                `${this.$url}/api/molecule/check`,
                { formula: this.formula, solution: parsedData }
            );

            console.log(result);

            if (result.status === 200) {
                const isCorrect = result.data.data.correct;
                if (isCorrect) {
                    this.color = "#65ff4a";
                    this.correctText = "correct";
                } else {
                    this.color = "#ff3333";
                    this.correctText = "incorrect";
                }
            }
        },
        async fetchData() {
            this.loading = true;
            this.formula = null;
            this.name = null;

            const result = await this.$http.get(
                `${this.$url}/api/molecule/${this.$route.params.formula}`
            );

            if (result.status >= 400) {
                console.error(result);
            } else {
                console.log(result.data);
                this.formula = result.data.data.formula;
                this.name = result.data.data.name;
                this.loading = false;
            }

            const molecules = await this.$http.get(`${this.$url}/api/molecule`);
            if (molecules.status >= 400) {
                console.error(molecules);
            } else {
                this.allMolecules = molecules.data.data;
            }
        }
    },
    async created() {
        await this.fetchData();
    }
});
</script>

<style scoped>
.fancy {
    font-family: Ensimmainen, fantasy;
}

.instructions {
    margin: 0;
    height: 100px;
    position: absolute;
    left: 150px;
    z-index: 100;
}

h3 {
    margin: 10px 0 0 0;
    font-size: 2.5em;
}

h5 {
    font-size: 2em;
    margin: 0 0 10px 0px;
}

.text-highlight {
    background: rgba(0, 0, 0, 0.05);
    padding: 8px 10px 4px 10px;
    border-radius: 5px;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
}

.flex-row {
    display: flex;
    flex-direction: row;
}

.element-link {
    background: #ffffff;
    padding: 15px;
    border-radius: 5px;
    margin: 3px;
}

.element-link:hover {
    box-shadow: 0px 2px 3px #a8a8a8;
}

.element-link a {
    color: #222;
    text-decoration: none;
}

.answer {
    position: absolute;
    width: 25%;
    height: 30%;
    right: 0;
    top: 100px;
    text-align: center;
    display: flex;
    flex-direction: column;
    font-family: Ensimmainen;
    color: black;
    font-size: 50px;
    font-weight: 500;
    z-index: 10;
}

.answer .emphasize {
    font-weight: 800;
}
</style>