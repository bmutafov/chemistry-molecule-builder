import 'jointjs/dist/joint.core.css';

import * as jointjs from 'jointjs/src/core.mjs';
import RoughElement from '../components/rough-elements/element';
import RoughLink from '../components/rough-elements/link';

export default {
    install: function(Vue) {
        let joint = {};
        for (let [key, value] of Object.entries(jointjs)) {
            joint[key] = value;
        }
        Object.defineProperty(Vue.prototype, '$joint', { value: joint });

        Vue.prototype.$roughElementDefinition = RoughElement;

        Vue.prototype.$roughLink = RoughLink;

        Vue.prototype.roughCircle = (label, bodyColor, labelColor) => {
            const circle = RoughElement.create('ellipse').prop({
                size: { width: 70, height: 70 },
                position: { x: 0, y: 0 },
                attrs: {
                    body: {
                        rough: {
                            hachureAngle: 60,
                            hachureGap: 10,
                            fillStyle: 'solid',
                        },
                        fill: bodyColor,
                        stroke: bodyColor,
                    },
                    border: {
                        rough: {
                            hachureAngle: 60,
                            hachureGap: 8,
                        },
                    },
                    label: {
                        refX: 35,
                        refY: 10,
                        text: label,
                        stroke: labelColor,
                    },
                },
            });
            circle.set('movable', true);
            return circle;
        };

        Vue.prototype.roughBox = () => {
            const color = '#fff4b5';

            const box = RoughElement.create('rectangle').prop({
                size: { width: 800, height: 150 },
                position: { x: 0, y: 0 },
                attrs: {
                    body: {
                        rough: {
                            hachureAngle: 60,
                            hachureGap: 10,
                            fillStyle: 'zigzag-line',
                        },
                        fill: color,
                        stroke: color,
                    },
                    border: {
                        rough: {
                            hachureAngle: 60,
                            hachureGap: 8,
                        },
                    },
                    label: {
                        refX: 100,
                        refY: 10,
                        text: 'Available elements',
                    },
                },
            });
            box.set('movable', false);
            return box;
        };
    },
};
