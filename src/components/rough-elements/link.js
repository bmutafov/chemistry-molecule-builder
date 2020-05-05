import { dia } from 'jointjs/src/core.mjs';

const RoughLink = dia.Link.define(
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

export default RoughLink;
