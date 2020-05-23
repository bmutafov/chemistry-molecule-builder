<template>
    <div>
        <DrawBoard
            :background="background"
            v-on:init="setupGraph"
            v-on:submit="onSubmit"
            v-on:addAvailableElement="addAvailableElement"
            v-bind:color="color"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import DrawBoard from "./DrawBoard.vue";

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

            console.log(this.elementsLink);
            console.log(resultElements);

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
                this.config.availableElements.xOffset,
                i * this.config.availableElements.distance +
                    this.config.availableElements.yOffset
            );
            el.set("deleteable", false);
            el.set("nodeInfo", { element, i });
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

            const HEIGHT = Math.max(
                document.documentElement.clientHeight,
                window.innerHeight || 0
            );
            const box = this.roughBox(
                config.availableElements.boxWidth,
                config.availableElements.boxHeight === "vh"
                    ? HEIGHT
                    : config.availableElements.boxHeight,
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
