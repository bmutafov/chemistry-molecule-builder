import 'jointjs/dist/joint.core.css';

import * as jointjs from 'jointjs/src/core.mjs';

export default {
    install: function(Vue) {
        let joint = {};
        for (let [key, value] of Object.entries(jointjs)) {
            joint[key] = value;
        }
        Object.defineProperty(Vue.prototype, '$joint', { value: joint });

        Vue.prototype.$roughElementDefinition = function() {
            return joint.dia.Element.define(
                'rough.Rectangle',
                {
                    z: 2,
                    attrs: {
                        root: {
                            magnet: false,
                        },
                        border: {
                            rough: {
                                fillSketch: false,
                            },
                            stroke: '#333333',
                            strokeWidth: 2,
                            fill: 'none',
                        },
                        body: {
                            rough: {
                                fillSketch: true,
                            },
                            strokeWidth: 2,
                            stroke: '#c6c7e2',
                            fill: 'none',
                        },
                        label: {
                            textWrap: {
                                ellipsis: true,
                                width: '200%',
                                height: 200,
                            },
                            textVerticalAnchor: 'top',
                            textAnchor: 'middle',
                            fontFamily: 'fantasy',
                            refX: '50%',
                            refY: '100%',
                            refY2: 10,
                            fontSize: 20,
                            fontWeight: 'bold',
                            fill: '#FFFFFF',
                            stroke: '#333333',
                            strokeWidth: 0.8,
                            pointerEvents: 'none',
                        },
                    },
                },
                {
                    markup: [
                        {
                            tagName: 'path',
                            selector: 'body',
                        },
                        {
                            tagName: 'path',
                            selector: 'border',
                            attributes: {
                                'pointer-events': 'bounding-box',
                                magnet: 'on-shift',
                            },
                        },
                        {
                            tagName: 'text',
                            selector: 'label',
                        },
                    ],
                },
                {
                    attributes: {
                        rough: {
                            set: function(opt, bbox) {
                                var r = this.paper.rough;
                                if (!r) return;
                                var rOpt = {
                                    fill: 'dummy',
                                    hachureAngle: opt.hachureAngle,
                                    hachureGap: opt.hachureGap,
                                    fillStyle: opt.fillStyle,
                                };
                                var shape;
                                switch (opt.type) {
                                    case 'ellipse':
                                        shape = r.generator.ellipse(
                                            bbox.x + bbox.width / 2,
                                            bbox.y + bbox.height / 2,
                                            bbox.width,
                                            bbox.height,
                                            rOpt
                                        );
                                        break;
                                    case 'rectangle':
                                    default:
                                        shape = r.generator.rectangle(
                                            bbox.x,
                                            bbox.y,
                                            bbox.width,
                                            bbox.height,
                                            rOpt
                                        );
                                        break;
                                }
                                var sets = shape.sets;
                                return {
                                    d: r.opsToPath(
                                        sets[opt.fillSketch ? 0 : 1]
                                    ),
                                };
                            },
                        },
                    },
                }
            );
        };

        Vue.prototype.$roughLink = function() {
            return joint.dia.Link.define(
                'rough.Link',
                {
                    z: 1,
                    source: {
                        selector: 'border',
                    },
                    target: {
                        selector: 'border',
                    },
                    attrs: {
                        line: {
                            rough: { bowing: 2 },
                            stroke: '#333333',
                            strokeWidth: 2,
                            strokeLinejoin: 'round',
                            targetMarker: {
                                type: 'path',
                                d: 'M 10 -5 0 0 10 5 z',
                            },
                        },
                        wrapper: {
                            connection: true,
                            strokeWidth: 10,
                            strokeLinejoin: 'round',
                        },
                    },
                },
                {
                    markup: [
                        {
                            tagName: 'path',
                            selector: 'wrapper',
                            attributes: {
                                fill: 'none',
                                cursor: 'pointer',
                                stroke: 'transparent',
                                'stroke-linecap': 'round',
                            },
                        },
                        {
                            tagName: 'path',
                            selector: 'line',
                            attributes: {
                                fill: 'none',
                                'pointer-events': 'none',
                            },
                        },
                    ],
                },
                {
                    attributes: {
                        rough: {
                            set: function(opt) {
                                var r = this.paper.rough;
                                if (!r) return;
                                var rOpt = {
                                    bowing: opt.bowing || 1,
                                };
                                return {
                                    d: r.opsToPath(
                                        r.generator.path(
                                            this.getSerializedConnection(),
                                            rOpt
                                        ).sets[0]
                                    ),
                                };
                            },
                        },
                    },
                }
            );
        };
    },
};
