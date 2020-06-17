<template>
    <fragment>
        <div ref="joint" class="paper" id="paper"></div>
    </fragment>
</template>

<script lang="ts">
import { Fragment } from 'vue-fragment';
import Rough from 'roughjs/bundled/rough.cjs.js';
import RoughLink from './rough-elements/link';
// import { shapes } from 'jointjs/joint.mjs';

export default {
    name: 'Canvas',
    components: {
        Fragment,
    },
    props: {
        background: {
            type: [Object, Boolean],
            default: false,
        },
        paperHolderId: String,
        color: String,
    },
    methods: {
        createPaper() {
            const paper = new this.$joint.dia.Paper({
                el: this.$refs.joint,
                cellViewNamespace: this.$joint.shapes,
                model: this.graph,
                width: '100%',
                height: '100%',
                gridSize: this.config.paper.gridSize,
                drawGrid: this.config.paper.drawGrid,
                background: this.background,
                connectionStrategy: this.$joint.connectionStrategies.pinAbsolute,
                async: true,
                clickTreshold: 5,
                defaultConnectionPoint: {
                    name: 'boundary',
                },
                allowLink: linkView => {
                    const { source, target } = linkView.model.attributes;
                    return source.anchor && target.anchor;
                },
                validateMagnet: function(_view, magnet, evt) {
                    return magnet.getAttribute('magnet') === 'on-shift' && evt.shiftKey;
                },
                defaultLink: function() {
                    let link = new RoughLink();
                    link.set('movable', true);
                    link.set('deleteable', true);
                    return link;
                },
                interactive: cellView => {
                    return cellView.model.get('movable');
                },
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
                    name: 'addClass',
                    options: {
                        className: 'highlighted-cell',
                        // rx: 10000,
                        // ry: 10000,
                        // attrs: {
                        //     'stroke-width': 3,
                        //     stroke: '#7ae0ff',
                        // },
                    },
                },
            };

            this.paper.on({
                'link:mouseenter': function(linkView) {
                    linkView.addTools(
                        new joint.dia.ToolsView({
                            tools: [
                                new joint.linkTools.Remove({
                                    distance: config.link.removeButtOffset,
                                }),
                            ],
                        })
                    );
                },
                'element:pointerdown': function(elementView) {
                    selectedModelPosition = {
                        ...elementView.model.attributes.position,
                    };
                },
                'element:pointerup': elementView => {
                    if (!elementView.model.get('movable')) return;
                    const currentPos = elementView.model.attributes.position;

                    if (currentPos.y < this.config.availableElements.boxHeight) {
                        elementView.model.position(selectedModelPosition.x, selectedModelPosition.y);
                    } else {
                        if (!elementView.model.get('deleteable')) {
                            elementView.model.set('deleteable', true);
                            const { element, i } = elementView.model.get('nodeInfo');
                            this.$emit('addAvailableElement', element, i);
                        }
                    }
                },
                'element:mouseenter': function(elementView) {
                    if (elementView.model.get('movable')) {
                        elementView.highlight(null, highlightOptions);
                    }

                    if (!elementView.model.get('movable') || !elementView.model.get('deleteable')) {
                        return;
                    }

                    let model = elementView.model;
                    let bbox = model.getBBox();
                    let ellipseRadius = 1 - Math.cos(joint.g.toRad(45));
                    let offset =
                        model.attr(['pointers', 'pointerShape']) === 'ellipse'
                            ? {
                                  x: (-ellipseRadius * bbox.width) / 2,
                                  y: (ellipseRadius * bbox.height) / 2,
                              }
                            : { x: -3, y: 3 };

                    elementView.addTools(
                        new joint.dia.ToolsView({
                            tools: [
                                new joint.elementTools.Remove({
                                    useModelGeometry: true,
                                    y: '0%',
                                    x: '100%',
                                    offset,
                                }),
                            ],
                        })
                    );
                },
                'cell:mouseleave': function(cellView) {
                    cellView.removeTools();
                    cellView.unhighlight(null, highlightOptions);
                },
            });
        },
        scaleContentToFit() {
            this.paper.scaleContentToFit({ minScaleX: 0.6, minScaleY: 0.6 });
            this.addBorder();
        },
        addBorder() {
            if (this.border) {
                this.paper.svg.removeChild(this.border);
            }
            const paperSize = {
                width: document.getElementById(this.paperHolderId).clientWidth,
                height: document.getElementById(this.paperHolderId).clientHeight,
            };

            const padding = 4;
            const borderEl = this.paper.rough.rectangle(padding, padding, paperSize.width - 2 * padding, paperSize.height - 2 * padding, {
                roughness: 1,
                seed: 18786,
                strokeWidth: 2,
                disableMultiStroke: true,
            });
            this.paper.svg.appendChild(borderEl);
            this.border = borderEl;
        },
    },
    mounted() {
        this.graph = new this.$joint.dia.Graph();

        this.createPaper();

        this.addPaperListeners();

        window.addEventListener('resize', this.$joint.util.debounce(this.scaleContentToFit), false);

        this.scaleContentToFit();

        this.$emit('init', this.graph, this.paper);
    },
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
</style>
