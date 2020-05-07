<template>
    <div>
        <div ref="joint" class="paper"></div>
        <button v-on:click="submit">Done</button>
    </div>
</template>

<script lang="ts">
import Rough from "roughjs/bundled/rough.cjs.js";

export default {
    name: "DrawBoard",
    props: {
        background: {
            type: [Object, Boolean],
            default: false
        }
    },
    methods: {
        submit() {
            const data = this.graph.toJSON();
            this.$emit("submit", data);
        }
    },
    created() {
        this.name = this.$options.name;
        console.log(`[${this.name}] Created`);
        this.graph = new this.$joint.dia.Graph();
    },
    mounted() {
        console.log(`[${this.name}] Mounted:`, this.$refs.joint);
        const RoughLink = this.$roughLink;

        const paper = new this.$joint.dia.Paper({
            el: this.$refs.joint,
            cellViewNamespace: this.$joint.shapes,
            model: this.graph,
            width: this.config.paper.width,
            height: this.config.paper.height,
            gridSize: this.config.paper.gridSize,
            drawGrid: this.config.paper.drawGrid,
            background: this.background,
            connectionStrategy: this.$joint.connectionStrategies.pinAbsolute,
            async: true,
            clickTreshold: 5,
            defaultConnectionPoint: {
                name: "bbox"
            },
            allowLink: linkView => {
                const { source, target } = linkView.model.attributes;
                return source.anchor && target.anchor;
            },
            validateMagnet: function(_view, magnet, evt) {
                return (
                    magnet.getAttribute("magnet") === "on-shift" && evt.shiftKey
                );
            },
            defaultLink: function() {
                let link = new RoughLink();
                link.set("moveable", true);
                link.set("deleteable", true);
                return link;
            },
            interactive: cellView => {
                return cellView.model.get("movable");
            }
        });
        const rough = Rough.svg(paper.svg);
        const padding = 4;
        const borderEl = rough.rectangle(
            padding,
            padding,
            this.config.paper.width - 2 * padding,
            this.config.paper.height - 2 * padding
        );
        paper.svg.appendChild(borderEl);
        paper.rough = rough;

        const joint = this.$joint;
        const config = this.config;
        let selectedModelPosition;

        paper.on({
            "link:mouseenter": function(linkView) {
                linkView.addTools(
                    new joint.dia.ToolsView({
                        tools: [
                            new joint.linkTools.Remove({
                                distance: config.link.removeButtOffset
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

                if (currentPos.y < this.config.availableElements.boxHeight) {
                    elementView.model.position(
                        selectedModelPosition.x,
                        selectedModelPosition.y
                    );
                } else {
                    if (!elementView.model.get("deleteable")) {
                        elementView.model.set("deleteable", true);
                        const { element, i } = elementView.model.get("element");
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

        this.$emit("init", this.graph, paper);
    }
};
</script>

<style scoped>
.paper {
    font-family: Ensimmainen, fantasy;
}
</style>
