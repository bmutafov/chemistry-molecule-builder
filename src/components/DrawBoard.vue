<template>
    <div>
        <div ref="joint" class="paper"></div>
        <div class="submit-butt-wrapper" @click="submit">
            <div class="submit-butt-inner-wrapper">
                <canvas
                    id="submit-butt"
                    class="submit-butt"
                    width="150"
                    height="80"
                ></canvas>
                <div class="submit-butt-text">DONE</div>
            </div>
        </div>
        <!-- <form id="submit" @submit.prevent="submit">
            <button class="submit-butt">Done</button>
        </form> -->
    </div>
</template>

<script lang="ts">
import Rough from "roughjs/bundled/rough.cjs.js";

export default {
    name: "DrawBoard",
    components: {},
    props: {
        background: {
            type: [Object, Boolean],
            default: false
        },
        color: String
    },
    methods: {
        submit() {
            const data = this.graph.toJSON();
            console.log(data, "sbm");
            this.$emit("submit", data);
        },
        createDoneButt() {
            const cnv = document.getElementById("submit-butt");
            const rc = Rough.canvas(cnv);
            rc.rectangle(0, 0, 150, 80, {
                fill: "#43bf5a",
                fillStyle: "solid",
                strokeWidth: 4
            });
        },
        drawRough() {
            const rough = Rough.svg(this.paper.svg);
            let points = [];
            for (let i = 0; i < 70; i++) {
                // 4pi - 400px
                let x = (400 / 20) * i;
                let xdeg = ((Math.PI / 100) * x) / 2;
                let y = Math.round(Math.sin(xdeg) * 60) + this.WIDTH * 0.9;
                points.push([y, x]);
            }
            points.push([this.WIDTH + 50, this.HEIGHT]);
            points.push([this.WIDTH + 50, 0]);

            var borderEl = rough.curve(points, {
                roughness: 1.5,
                strokeWidth: 5,
                fill: this.color,
                fillStyle: "solid"
            });
            this.paper.svg.appendChild(borderEl);
            this.paper.rough = rough;
        }
    },
    watch: {
        color: function(newVal, oldVal) {
            console.log(newVal, oldVal);
            this.drawRough();
        }
    },
    created() {
        this.name = this.$options.name;
        console.log(`[${this.name}] Created`);
        this.graph = new this.$joint.dia.Graph();
    },
    mounted() {
        this.createDoneButt();

        console.log(`[${this.name}] Mounted 1:`, this.$refs.joint);
        const RoughLink = this.$roughLink;

        this.WIDTH =
            Math.max(
                document.documentElement.clientWidth,
                window.innerWidth || 0
            ) * 0.8; //this.config.paper.width
        this.HEIGHT = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        ); //this.config.paper.height

        const paper = new this.$joint.dia.Paper({
            el: this.$refs.joint,
            cellViewNamespace: this.$joint.shapes,
            model: this.graph,
            width: this.WIDTH,
            height: this.HEIGHT,
            gridSize: this.config.paper.gridSize,
            drawGrid: this.config.paper.drawGrid,
            background: this.background,
            connectionStrategy: this.$joint.connectionStrategies.pinAbsolute,
            async: true,
            clickTreshold: 5,
            defaultConnectionPoint: {
                name: "boundary"
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
        this.paper = paper;

        this.drawRough();

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
                        const { element, i } = elementView.model.get(
                            "nodeInfo"
                        );
                        this.$emit("addAvailableElement", element, i);
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

.submit-butt-wrapper {
    position: absolute;
    bottom: 20px;
    right: 10px;
    width: 150px;
    height: 80px;
    cursor: pointer;
}

.submit-butt-inner-wrapper {
    position: relative;
}

.submit-butt-inner-wrapper canvas {
    position: absolute;
    top: 0;
    left: 0;
}

.submit-butt-text {
    font-family: Ensimmainen, fantasy;
    font-size: 40px;
    color: black;
    font-weight: bold;
    position: absolute;
    top: 20px;
    width: 150px;
    text-align: center;
}
</style>
