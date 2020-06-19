<template>
    <div class="page">
        <div class="col">
            <CssLoader v-if="!molecules" />
            <ul v-else>
                <div class="instructions">
                    <h3 class="fancy">Levels</h3>
                </div>
                <a v-for="molecule in molecules" :key="molecule.formula" :href="`#/game/${molecule.formula}`">
                    <li :class="formula === molecule.formula ? 'active': ''"> 
                        <img src="https://image.flaticon.com/icons/png/512/883/883026.png" /> 
                        {{ molecule.formula }}
                        <b>{{ molecule.name }}</b>
                    </li>
                </a>
                <!-- <li class="active"> <img src="https://image.flaticon.com/icons/png/512/883/883026.png" /> C6H6</li> -->
            </ul>
        </div>
        <div class="col-2">
            <CssLoader v-if="loading" />
            <div class="flex-col" v-else>
                <div class="instructions">
                    <h3 class="fancy">Compose the molecule of {{ name }} ({{ formula }})</h3>
                </div>
                <div id="paper-container">
                    <Canvas :background="background" :paperHolderId="paperHolderId" v-on:init="setupGraph" v-on:addAvailableElement="addAvailableElement" v-bind:color="color" />
                </div>
                <div class="button-holder">
                    <RoughButton class="button" type="warning" @submit="help"> <img src="https://image.flaticon.com/icons/svg/2476/2476190.svg" /> Help </RoughButton>
                    <RoughButton class="button" type="error" @submit="reset"> <img src="https://image.flaticon.com/icons/svg/2039/2039083.svg" /> Reset </RoughButton>
                    <RoughButton class="button" type="success" @submit="submit"> <img src="https://image.flaticon.com/icons/svg/1828/1828743.svg"> Submit </RoughButton>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Canvas from "./Canvas.vue";
import RoughButton from "./RoughButton.vue";
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
        RoughButton,
        CssLoader
    },
    watch: {
        async $route() {
            await this.getMoleculeData();
            await this.setupGraph(this.graph, this.paper);
        }
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
            radius: 70,
            molecules: false
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
        async getAllMolecules() {
            const result = await this.$http.get(`${this.$url}/api/molecule`);

            this.molecules = result.data.data;
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
            this.paper = paper;
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

            if (result.status === 200) {
                const isCorrect = result.data.data.correct;
                this.fireSwal(isCorrect);
            }
        },
        reset() {
            const cells = this.graph
                .getCells()
                .filter(c => c.get("deleteable"));
            this.graph.removeCells(cells);
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
                    },
                    showLoaderOnConfirm: true,
                    preConfirm: async () => {
                        return await this.$http.get(
                            `${this.$url}/api/molecule`
                        );
                    },
                    allowOutsideClick: () => !this.$swal.isLoading()
                }).then(result => {
                    if (result.value) {
                        const { data } = result.value.data;
                        // ensure same order every time
                        data.sort((a, b) => (a.formula > b.formula ? -1 : 1));
                        let currentIndex = data.findIndex(
                            m => m.formula === this.formula
                        );
                        const nextIndex =
                            currentIndex === data.length - 1
                                ? 0
                                : currentIndex + 1;
                        console.log({
                            currentIndex,
                            nextIndex,
                            go: `/game/${data[nextIndex].formula}`
                        });

                        this.$router.push({
                            name: "Game",
                            params: { formula: data[nextIndex].formula }
                        });
                        // console.log(result.value);
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
        },
        help() {
            this.$swal
                .mixin({
                    confirmButtonText: "Next &rarr;",
                    showCancelButton: true,
                    cancelButtonText: "Close",
                    cancelButtonColor: "#fff",
                    customClass: {
                        cancelButton: "cancel-button"
                    },
                    heightAuto: false,
                    reverseButtons: true,
                    progressSteps: ["1", "2", "3", "4"]
                })
                .queue([
                    {
                        title: "Controls",
                        html:
                            "<img src='https://i.snipboard.io/pIgTYM.jpg' /> <br /> \
                            You can choose what action you want to perform by clicking the respective button in the action select menu!"
                    },
                    {
                        title: "Moving elements",
                        html:
                            "<img src='https://i.imgur.com/ognkPi5.gif' /><br /> \
                            Drag and drop to move elements. When you need new elements just take them from the elements bar!"
                    },
                    {
                        title: "Creating bonds",
                        html:
                            "<img src='https://i.imgur.com/T61wzFy.gif' /><br /> \
                            Choose <i>\"Connect mode\"</i> to create bonds between two elements. You can alternatively hold <b>⇧ shift</b> and left click while on move mode."
                    },
                    {
                        title: "Deleting",
                        html:
                            "<img src='https://i.imgur.com/UR4lMoi.gif' /><br /> \
                            Choose <i>\"Delete mode\"</i> to delete existing elements or bonds. You can alternatively hover and press the (x) button while on move or connect mode."
                    }
                ]);
        }
    },
    async beforeMount() {
        await this.getAllMolecules();
        await this.getMoleculeData();
    }
});
</script>

<style>
a {
    text-decoration: none;
}

.page {
    height: 100%;
    display: flex;
    flex-direction: row;
}

.col {
    flex: 1;
    background: #f8f8f8;
    margin-right: 10px;
}

.col ul {
    list-style-type: disc;
    padding: 0;
    text-align: left;
}

.col ul li {
    padding: 15px 20px;
    background: transparent;
    margin: 10px 5px;
    border-radius: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: 0.2s;
    cursor: pointer;
    color: rgb(71, 71, 71);
}

.col ul li:hover {
    background: #ffffff;
}

.col ul li b {
    margin-left: 10px;
    font-size: 0.8rem;
}

.col ul li > img {
    width: 34px;
    height: 34px;
    margin-right: 20px;
}

.col ul li.active {
    background: #ffffff;
    color: #c0c0c0;
    cursor: default;
}

.col-2 {
    flex: 4;
}

.unmovable-cell {
    cursor: default !important;
}

#paper-container {
    width: 100%;
    height: 100%;
}

@media screen and (max-width: 864px) {
    .page {
        flex-direction: column;
    }
    #paper-container {
        min-height: 800px;
    }
}
.fancy {
    font-family: Ensimmainen, fantasy;
}

.instructions {
    margin: 10px 10px;
}

h3 {
    font-size: 2.5em;
    margin: 0;
}

.flex-col {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: flex-start;
}

.flex-col:nth-child(1) {
    flex-grow: 4;
    height: 100%;
}

.cancel-button {
    color: rgb(131, 131, 131) !important;
}

.button-holder {
    display: flex;
    align-items: center;
    height: 100px;
    margin-left: 10px;
}

.button {
    margin-right: 20px;
}
</style>
