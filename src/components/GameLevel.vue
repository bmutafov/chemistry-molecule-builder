<template>
    <DrawBoard
        :background="background"
        :grid-size="gridSize"
        :draw-grid="drawGrid"
        v-on:init="setupGraph"
    />
</template>

<script lang="ts">
import Vue from "vue";
import DrawBoard from "./DrawBoard.vue";
// import joint from "jointjs";
// import { RoughElement, RoughLink, Element } from "./rough-elements/element";

export default Vue.extend({
    name: "GameLevel",
    components: {
        DrawBoard
    },
    data() {
        return {
            background: {
                color: "white"
            },
            gridSize: 1,
            drawGrid: false
        };
    },
    methods: {
        addAvailableElement(element, i) {
            console.log(element, i);
            const el = this.roughCircle(
                element.label,
                element.bodyColor,
                element.labelColor
            );
            el.position(i * 80 + 20, 60);
            el.set("deleteable", false);
            el.set("element", { element, i });
            this.graph.addCells(el);
        },
        availableElements(elements) {
            this.elements = elements;
            elements.forEach((element, i) => {
                this.addAvailableElement(element, i);
            });
        },
        setupGraph(graph, paper) {
            this.graph = graph;
            const joint = this.$joint;

            const box = this.roughBox();

            graph.addCells(box);

            this.availableElements([
                {
                    label: "H",
                    bodyColor: "#ff00ff",
                    labelColor: "#ffffff"
                }
            ]);
            joint.V(paper.findViewByModel(box).el).addClass("unmovable-cell");

            let selectedModelPosition;

            paper.on({
                "link:mouseenter": function(linkView) {
                    linkView.addTools(
                        new joint.dia.ToolsView({
                            tools: [
                                new joint.linkTools.Vertices({ snapRadius: 0 }),
                                new joint.linkTools.Remove({
                                    distance: "48%"
                                })
                            ]
                        })
                    );
                },
                "element:pointerdown": function(elementView) {
                    selectedModelPosition = {
                        ...elementView.model.attributes.position
                    };
                },
                "element:pointerup": elementView => {
                    const currentPos = elementView.model.attributes.position;

                    if (currentPos.y < 160) {
                        elementView.model.position(
                            selectedModelPosition.x,
                            selectedModelPosition.y
                        );
                    } else {
                        if (!elementView.model.get("deleteable")) {
                            elementView.model.set("deleteable", true);
                            const { element, i } = elementView.model.get(
                                "element"
                            );
                            this.addAvailableElement(element, i);
                        }
                    }
                },
                "element:mouseenter": function(elementView) {
                    if (
                        !elementView.model.get("movable") ||
                        !elementView.model.get("deleteable")
                    )
                        return;
                    let model = elementView.model;
                    let bbox = model.getBBox();
                    let ellipseRadius = 1 - Math.cos(joint.g.toRad(45));
                    let offset =
                        model.attr(["pointers", "pointerShape"]) === "ellipse"
                            ? {
                                  x: (-ellipseRadius * bbox.width) / 2,
                                  y: (ellipseRadius * bbox.height) / 2
                              }
                            : { x: -3, y: 3 };

                    elementView.addTools(
                        new joint.dia.ToolsView({
                            tools: [
                                new joint.elementTools.Remove({
                                    useModelGeometry: true,
                                    y: "0%",
                                    x: "100%",
                                    offset: offset
                                })
                            ]
                        })
                    );
                },
                "cell:mouseleave": function(cellView) {
                    cellView.removeTools();
                }
            });
        }
    }
});
</script>

<style>
.unmovable-cell {
    cursor: default !important;
}
</style>
