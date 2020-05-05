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
                color: "antiquewhite"
            },
            gridSize: 1,
            drawGrid: false
        };
    },
    methods: {
        setupGraph(graph, paper) {
            console.log(graph, paper);

            const RoughElement = this.$roughElementDefinition();
            const joint = this.$joint;

            const el = new RoughElement({
                size: { width: 100, height: 50 },
                position: { x: 50, y: 50 },
                attrs: {
                    body: {
                        rough: {
                            hachureAngle: 60,
                            hachureGap: 8
                        }
                    },
                    border: {
                        rough: {
                            hachureAngle: 60,
                            hachureGap: 8
                        }
                    },
                    label: {
                        text: "RoughJS"
                    }
                }
            });

            paper.on({
                "link:mouseenter": function(linkView) {
                    linkView.addTools(
                        new joint.dia.ToolsView({
                            tools: [
                                new joint.linkTools.Vertices({ snapRadius: 0 }),
                                new joint.linkTools.SourceArrowhead(),
                                new joint.linkTools.TargetArrowhead(),
                                new joint.linkTools.Remove({
                                    distance: 20
                                })
                            ]
                        })
                    );
                },
                "element:pointerdown": function(elementView) {
                    console.log(elementView);
                },
                "element:mouseenter": function(elementView) {
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
            graph.resetCells([el]);
        }
    }
});
</script>

<style scoped></style>
