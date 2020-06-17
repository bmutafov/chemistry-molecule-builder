<template>
    <div style="height: 100%">
        <div class="flex-col">
            <div class="instructions">
                <h3 class="fancy">Compose the molecule of {{ name }} ({{ formula }})</h3>
            </div>
            <div id="paper-container">
                <Canvas :paperHolderId="paperHolderId" v-on:init="setupGraph" v-on:addAvailableElement="addAvailableElement" />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import Canvas from './Canvas.vue';
import parseGraph from '../utils/graph-parser';

export default Vue.extend({
    name: 'GameLevelCreator',
    components: {
        Canvas,
    },
    props: {
        name: String,
        formula: String,
    },
    data() {
        return {
            paperHolderId: 'paper-container',
            radius: 70,
        };
    },
    methods: {
        getSolution() {
            const graphJSON = this.graph.toJSON();
            const solution = parseGraph(graphJSON);
            return solution;
        },
        async getElementsForRender() {
            const url = `${this.$url}/api/element`;
            console.log(`Get: ${url}`);
            const resultElements = await this.$http.get(url, {
                headers: { 'auth-token': this.$cookies.get('auth-token') },
            });

            if (resultElements.status >= 400) return false;

            const data = resultElements.data.data;
            return data;
        },
        addAvailableElement(element, i, count) {
            // Creates the element

            const offsetPerElement = () => this.radius + this.config.availableElements.distance;

            const width = document.getElementById('paper-container').clientWidth;
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

            const el = this.roughCircle(this.radius, element.sign, element.bgColor, element.labelColor);

            // Sets it position {x, y}
            el.position(i * offsetPerElement() + this.config.availableElements.xOffset, this.config.availableElements.yOffset);

            // Set it to be non-deleteable and attach its information
            el.set('deleteable', false);
            el.set('nodeInfo', { element, i });

            // Add the elements to the graph
            this.graph.addCells(el);
        },
        async setupGraph(graph, paper) {
            this.graph = graph;
            const joint = this.$joint;
            const config = this.config;

            // Creates the element holder box
            const box = this.roughBox(document.getElementById('paper-container').clientWidth, config.availableElements.boxHeight, config.availableElements.boxText);

            graph.addCells(box);

            // Fetches and renders the lements
            const data = await this.getElementsForRender();
            data.forEach((element, i) => this.addAvailableElement(element, i, data.length));

            // Adds .unmovable-cell class to the holder box to attach custom styles
            joint.V(paper.findViewByModel(box).el).addClass('unmovable-cell');
        },
    },
    mounted() {},
});
</script>

<style scoped></style>
