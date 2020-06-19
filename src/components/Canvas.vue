<template>
    <fragment>
        <div class="paper-relative">
            <div ref="joint" class="paper" id="paper"></div>
            <div class="switch-container">
                <ActionSwitch action="move" :active="action === 'move'" img="https://image.flaticon.com/icons/svg/918/918738.svg" text="Move" @actionChange="this.changeAction" />
                <ActionSwitch action="connect" :active="action === 'connect'" img="https://image.flaticon.com/icons/svg/876/876225.svg" text="Connect" @actionChange="this.changeAction" />
                <ActionSwitch action="delete" :active="action === 'delete'" img="https://image.flaticon.com/icons/svg/1450/1450571.svg" text="Delete" @actionChange="this.changeAction" />
                <!-- <button class="switch"> <img src="https://image.flaticon.com/icons/svg/918/918738.svg" /> Move </button>
                <button class="switch"> <img src="https://image.flaticon.com/icons/svg/876/876225.svg" /> Connect </button>
                <button class="switch"> <img src="https://image.flaticon.com/icons/svg/1450/1450571.svg" /> Delete </button> -->
            </div>
        </div>
    </fragment>
</template>

<script lang="ts">
import { Fragment } from "vue-fragment";
import Rough from "roughjs/bundled/rough.cjs.js";
import RoughLink from "./rough-elements/link";
import ActionSwitch from "./ActionSwitch.vue";
// import { shapes } from 'jointjs/joint.mjs';

export default {
    name: "Canvas",
    components: {
        Fragment,
        ActionSwitch
    },
    props: {
        background: {
            type: [Object, Boolean],
            default: false
        },
        paperHolderId: String,
        color: String
    },
    data() {
        return {
            action: "move"
        };
    },
    methods: {
        validateMagnet(_view, magnet, evt) {
            return (
                this.action === "connect" ||
                (magnet.getAttribute("magnet") === "on-shift" && evt.shiftKey)
            );
        },
        createPaper() {
            const validateMagnet = this.validateMagnet;
            const paper = new this.$joint.dia.Paper({
                el: this.$refs.joint,
                cellViewNamespace: this.$joint.shapes,
                model: this.graph,
                width: "100%",
                height: "100%",
                gridSize: this.config.paper.gridSize,
                drawGrid: this.config.paper.drawGrid,
                background: this.background,
                connectionStrategy: this.$joint.connectionStrategies
                    .pinAbsolute,
                async: true,
                clickTreshold: 5,
                defaultConnectionPoint: {
                    name: "boundary"
                },
                allowLink: linkView => {
                    const { source, target } = linkView.model.attributes;
                    return source.anchor && target.anchor;
                },
                validateMagnet: validateMagnet,
                defaultLink: function() {
                    let link = new RoughLink();
                    link.set("movable", true);
                    link.set("deleteable", true);
                    return link;
                },
                interactive: cellView => {
                    return cellView.model.get("movable");
                }
            });
            this.paper = paper;
            this.paper.rough = Rough.svg(this.paper.svg);
        },
        addPaperListeners() {
            const joint = this.$joint;
            const config = this.config;
            let selectedModelPosition;
            const highlightOptions = {
                highlighter: {
                    name: "addClass",
                    options: {
                        className: "highlighted-cell"
                    }
                }
            };

            this.paper.on({
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
                    if (!elementView.model.get("movable")) return;
                    const currentPos = elementView.model.attributes.position;

                    if (
                        currentPos.y < this.config.availableElements.boxHeight
                    ) {
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
                    if (elementView.model.get("movable")) {
                        elementView.highlight(null, highlightOptions);
                    }

                    if (
                        !elementView.model.get("movable") ||
                        !elementView.model.get("deleteable")
                    ) {
                        return;
                    }

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
                                    offset
                                })
                            ]
                        })
                    );
                },
                "cell:mouseleave": function(cellView) {
                    cellView.removeTools();
                    cellView.unhighlight(null, highlightOptions);
                }
            });
        },
        scaleContentToFit() {
            this.paper.scaleContentToFit({
                minScaleX: 1,
                minScaleY: 1,
                maxScaleX: 1.1,
                maxScaleY: 1.1
            });
            this.addBorder();
        },
        addBorder() {
            if (this.border) {
                this.paper.svg.removeChild(this.border);
            }
            const paperSize = {
                width: document.getElementById(this.paperHolderId).clientWidth,
                height: document.getElementById(this.paperHolderId).clientHeight
            };

            const padding = 4;
            const borderEl = this.paper.rough.rectangle(
                padding,
                padding,
                paperSize.width - 2 * padding,
                paperSize.height - 2 * padding,
                {
                    roughness: 1,
                    seed: 18786,
                    strokeWidth: 2,
                    disableMultiStroke: true
                }
            );
            this.paper.svg.appendChild(borderEl);
            this.border = borderEl;
        },
        changeAction(action) {
            console.log(`Action changed to: ${action}`);
            this.action = action;
        }
    },
    mounted() {
        this.graph = new this.$joint.dia.Graph();

        this.createPaper();

        this.addPaperListeners();

        window.addEventListener(
            "resize",
            this.$joint.util.debounce(this.scaleContentToFit),
            false
        );

        this.scaleContentToFit();

        this.$emit("init", this.graph, this.paper);
    }
};
</script>

<style>
.paper {
    font-family: Ensimmainen, fantasy;
}

.highlighted-cell {
    outline: 20px;
    opacity: 0.9;
    stroke: rgb(82, 200, 255);
    stroke-width: 10px;
}

.paper-relative {
    position: relative;
    height: 100%;
}

.switch-container {
    position: absolute;
    top: 110px;
    right: 5px;
    height: 50px;
    display: flex;
    flex-direction: row;
}
</style>
