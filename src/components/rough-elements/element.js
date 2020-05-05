let RoughDefinitions = {};
RoughDefinitions.install = function(Vue) {
    Vue.roughElement = Vue.$joint.dia.Element.define(
        'rough.Rectangle',
        {
            z: 2,
            attrs: {
                root: {
                    magnet: false,
                },
                pointers: {
                    refWidth: '100%',
                    refHeight: '100%',
                    pointerShape: 'rectangle',
                },
                border: {
                    rough: {
                        fillSketch: false,
                    },
                    stroke: '#333333',
                    strokeWidth: 2,
                },
                body: {
                    rough: {
                        fillSketch: true,
                    },
                    strokeWidth: 2,
                    stroke: '#c6c7e2',
                },
                label: {
                    textWrap: {
                        ellipsis: true,
                        width: '200%',
                        height: 200,
                    },
                    textVerticalAnchor: 'top',
                    textAnchor: 'middle',
                    fontFamily: 'Ensimmainen',
                    refX: '50%',
                    refY: '13%',
                    refY2: 10,
                    fontSize: 30,
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
                    selector: 'pointers',
                    attributes: {
                        magnet: 'on-shift',
                        fill: 'transparent',
                    },
                },
                {
                    tagName: 'path',
                    selector: 'body',
                    attributes: {
                        'pointer-events': 'none',
                    },
                },
                {
                    tagName: 'path',
                    selector: 'border',
                    attributes: {
                        'pointer-events': 'none',
                        fill: 'none',
                    },
                },
                {
                    tagName: 'text',
                    selector: 'label',
                },
            ],
        },
        {
            create: function(type) {
                return new this({
                    attrs: {
                        pointers: {
                            pointerShape: type,
                        },
                        body: {
                            rough: {
                                type: type,
                            },
                        },
                        border: {
                            rough: {
                                type: type,
                            },
                        },
                    },
                });
            },

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
                        return { d: r.opsToPath(sets[opt.fillSketch ? 0 : 1]) };
                    },
                },
                // pointerShape: {
                //     set: function(type, bbox) {
                //         var vel;
                //         var width = bbox.width;
                //         var height = bbox.height;
                //         switch (type) {
                //             case 'ellipse':
                //                 vel = V('ellipse').attr({
                //                     cx: width / 2,
                //                     cy: height / 2,
                //                     rx: width / 2,
                //                     ry: height / 2,
                //                 });
                //                 break;
                //             default:
                //                 vel = V('rect').attr({
                //                     width: width,
                //                     height: height,
                //                 });
                //                 break;
                //         }
                //         return { d: vel.convertToPathData() };
                //     },
                // },
            },
        }
    );

    Vue.roughLink = this.$joint.dia.Link.define(
        'rough.Link',
        {
            z: 1,
            attrs: {
                line: {
                    rough: { bowing: 1 },
                    stroke: '#333333',
                    strokeWidth: 2,
                    strokeLinejoin: 'round',
                    targetMarker: {
                        type: 'none',
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

    Vue.createElement = class Element {
        constructor(bodyColor, labelColor, label) {
            this.width = 70;
            this.height = 70;

            let el = this.$roughElement.create('ellipse').prop({
                size: { width: 70, height: 70 },
                position: { x: 0, y: 0 },
                attrs: {
                    body: {
                        rough: {
                            hachureGap: 5,
                            fillStyle: 'solid',
                        },
                        stroke: bodyColor,
                        fill: bodyColor,
                    },
                    label: {
                        text: label,
                        stroke: labelColor,
                    },
                },
            });
            el.set('isModifiable', true);
            return el;
        }
    };
};

export default RoughDefinitions;
