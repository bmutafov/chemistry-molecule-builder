<template>
    <div style="height: 100%">
        <CssLoader v-if="loading" />
        <div class="flex-col" v-else>
            <div class="instructions">
                <h3 class="fancy">Compose the molecule of {{ name }} ({{ formula }})</h3>
            </div>
            <div id="paper-container">
                <Canvas :background="background" :paperHolderId="paperHolderId" v-on:init="setupGraph" v-on:addAvailableElement="addAvailableElement" v-bind:color="color" />
            </div>
            <div style="padding: 20px">
                <DoneButton @submit="submit" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Canvas from "./Canvas.vue";
import DoneButton from "./DoneButton.vue";
import CssLoader from "./CssLoader.vue";
import parseGraph from "../utils/graph-parser";

export default Vue.extend({
    name: "GameLevel",
    props: {
        elementsLink: {
            type: String
        },
        onSubmit: Function,
        color: String
    },
    components: {
        Canvas,
        DoneButton,
        CssLoader
    },
    data() {
        return {
            background: {
                color: "white"
            },
            loading: true,
            name: null,
            formula: null,
            paperHolderId: "paper-container",
            radius: 70
        };
    },
    methods: {
        /* Sends get request to the API to retrieve the elements included in the current molecule */
        async getElementsForRender() {
            const url = `${this.$url}/api/molecule/elements/${this.formula}`;
            console.log(`Get: ${url}`);
            const resultElements = await this.$http.get(url);

            if (resultElements.status >= 400) return false;

            const data = resultElements.data.data;
            return data;
        },
        async getMoleculeData() {
            this.loading = true;
            this.formula = null;
            this.name = null;

            console.log(this.$route.params.formula);

            const url = `${this.$url}/api/molecule/${this.$route.params.formula}`;
            console.log(`url: ${url}`);
            const result = await this.$http.get(url);

            console.log(result);
            if (result.status >= 400) {
                console.error(result);
            } else {
                this.formula = result.data.data.formula;
                this.name = result.data.data.name;
                this.loading = false;
            }
        },
        /* Adds the element to the canvas */
        addAvailableElement(element, i, count) {
            // Creates the element

            const offsetPerElement = () =>
                this.radius + this.config.availableElements.distance;

            const width = document.getElementById("paper-container")
                .clientWidth;
            const { xOffset } = this.config.availableElements;
            function calculateRadius() {
                const elementsTotalWidth = count * offsetPerElement() + xOffset;

                if (width < elementsTotalWidth) {
                    this.radius -= 5;
                    calculateRadius();
                } else {
                    return;
                }
            }

            calculateRadius();

            const el = this.roughCircle(
                this.radius,
                element.sign,
                element.bgColor,
                element.labelColor
            );

            // Sets it position {x, y}
            el.position(
                i * offsetPerElement() + this.config.availableElements.xOffset,
                this.config.availableElements.yOffset
            );

            // Set it to be non-deleteable and attach its information
            el.set("deleteable", false);
            el.set("nodeInfo", { element, i });

            // Add the elements to the graph
            this.graph.addCells(el);
        },
        /* Callback on the init listener from <Canvas></Canvas>*/
        async setupGraph(graph, paper) {
            this.graph = graph;
            const joint = this.$joint;
            const config = this.config;

            // Creates the element holder box
            const box = this.roughBox(
                document.getElementById("paper-container").clientWidth * 10,
                config.availableElements.boxHeight,
                config.availableElements.boxText
            );

            graph.addCells(box);

            // Fetches and renders the lements
            const data = await this.getElementsForRender();
            data.forEach((element, i) =>
                this.addAvailableElement(element, i, data.length)
            );

            // Adds .unmovable-cell class to the holder box to attach custom styles
            joint.V(paper.findViewByModel(box).el).addClass("unmovable-cell");
        },
        /* On submit handler */
        async submit() {
            const data = this.graph.toJSON();
            const parsedData = parseGraph(data);

            console.log({ formula: this.formula, solution: parsedData });

            const result = await this.$http.post(
                `${this.$url}/api/molecule/check`,
                { formula: this.formula, solution: parsedData }
            );

            console.log(result);

            if (result.status === 200) {
                const isCorrect = result.data.data.correct;
                this.fireSwal(isCorrect);
                console.log(isCorrect);
            }
        },
        fireSwal(isCorrect) {
            if (isCorrect) {
                this.$swal({
                    title: "Good job!",
                    text:
                        "You have entered the correct solution! Congratulations!",
                    icon: "success",
                    confirmButtonText: "Next Level",
                    showCancelButton: true,
                    cancelButtonText: "Stay",
                    cancelButtonColor: "#fff",
                    reverseButtons: true,
                    heightAuto: false,
                    customClass: {
                        cancelButton: "cancel-button"
                    }
                });
            } else {
                this.$swal({
                    title: "Not quite!",
                    text: "Your solution is not yet correct! Keep trying!",
                    icon: "error",
                    confirmButtonText: "Try again",
                    confirmButtonColor: "#bf1313",
                    heightAuto: false
                });
            }
        }
    },
    async beforeMount() {
        await this.getMoleculeData();
    }
});
</script>

<style>
.unmovable-cell {
    cursor: default !important;
}

#paper-container {
    width: 100%;
    height: 100%;
}

.fancy {
    font-family: Ensimmainen, fantasy;
}

.instructions {
    margin: 0;
    margin: 10px 0;
}

h3 {
    font-size: 2.5em;
    margin: 0;
}

.flex-col {
    display: flex;
    flex-direction: column;
}

.flex-col:nth-child(1) {
    flex-grow: 4;
    height: 100%;
}

.cancel-button {
    color: rgb(131, 131, 131) !important;
}
</style>
