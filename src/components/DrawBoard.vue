<template>
    <div ref="joint"></div>
</template>

<script lang="ts">
import Rough from "roughjs/bundled/rough.cjs.js";

export default {
    name: "DrawBoard",
    props: {
        width: {
            type: [String, Number],
            default: 800
        },
        height: {
            type: [String, Number],
            default: 800
        },
        gridSize: {
            type: Number,
            default: 1
        },
        drawGrid: {
            type: [Object, Boolean],
            default: false
        },
        background: {
            type: [Object, Boolean],
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.name = this.$options.name;
        console.log(`[${this.name}] Created`);
        this.graph = new this.$joint.dia.Graph();
    },
    mounted() {
        console.log(`[${this.name}] Mounted:`, this.$refs.joint);
        const RoughLink = this.$roughLink();

        const paper = new this.$joint.dia.Paper({
            el: this.$refs.joint,
            cellViewNamespace: this.$joint.shapes,
            model: this.graph,
            width: this.width,
            height: this.height,
            gridSize: this.gridSize,
            drawGrid: this.drawGrid,
            background: this.background,
            interactive: !this.readonly,
            connectionStrategy: this.$joint.connectionStrategies.pinAbsolute,
            async: true,
            clickTreshold: 5,
            defaultConnectionPoint: {
                name: "boundary",
                args: { selector: "border" }
            },
            validateMagnet: function(_view, magnet, evt) {
                return (
                    magnet.getAttribute("magnet") === "on-shift" && evt.shiftKey
                );
            },
            defaultLink: function() {
                let link = new RoughLink();
                link.set("isModifiable", true);
                return link;
            }
        });
        const rough = Rough.svg(paper.svg);
        const padding = 4;
        const borderEl = rough.rectangle(
            padding,
            padding,
            this.width - 2 * padding,
            this.height - 2 * padding
        );
        paper.svg.appendChild(borderEl);
        paper.rough = rough;

        this.$emit("init", this.graph, paper);
    }
};
</script>

<style scoped></style>
