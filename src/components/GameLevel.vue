<template>
    <DrawBoard
        :background="background"
        v-on:init="setupGraph"
        v-on:submit="onSubmit"
        v-on:addAvailableElement="addAvailableElement"
    />
</template>

<script lang="ts">
import Vue from "vue";
import DrawBoard from "./DrawBoard.vue";

export default Vue.extend({
    name: "GameLevel",
    props: {
        elementsLink: String,
        onSubmit: Function
    },
    components: {
        DrawBoard
    },
    data() {
        return {
            background: {
                color: "white"
            }
        };
    },
    methods: {
        async fetchData() {
            const resultElements = await this.$http.get(
                `${this.$url}${this.elementsLink}`,
                {
                    headers: { "auth-token": this.$cookies.get("auth-token") }
                }
            );
            if (resultElements.status >= 400) return false;

            const data = resultElements.data.data;
            return data;
        },
        addAvailableElement(element, i) {
            const el = this.roughCircle(
                element.sign,
                element.bgColor,
                element.labelColor
            );
            el.position(
                i * this.config.availableElements.distance +
                    this.config.availableElements.xOffset,
                this.config.availableElements.yOffset
            );
            el.set("deleteable", false);
            el.set("element", { element, i });
            this.graph.addCells(el);
        },
        availableElements(elements) {
            elements.forEach((element, i) => {
                this.addAvailableElement(element, i);
            });
        },
        async setupGraph(graph, paper) {
            this.graph = graph;
            const joint = this.$joint;
            const config = this.config;

            const box = this.roughBox(
                config.availableElements.boxWidth,
                config.availableElements.boxHeight,
                config.availableElements.boxText
            );

            graph.addCells(box);

            const data = await this.fetchData();
            this.availableElements(data);
            joint.V(paper.findViewByModel(box).el).addClass("unmovable-cell");
        }
    }
});
</script>

<style>
.unmovable-cell {
    cursor: default !important;
}
</style>
