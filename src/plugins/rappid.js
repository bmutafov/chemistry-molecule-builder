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

        Vue.prototype.roughCircle = (radius, label, bodyColor, labelColor) => {
            const circle = RoughElement.create('ellipse').prop({
                size: { width: radius, height: radius },
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
                        refX: radius / 2,
                        refY: radius / 10,
                        text: label,
                        stroke: labelColor,
                        fontSize: radius / 2,
                    },
                },
            });
            circle.set('movable', true);
            return circle;
        };

        Vue.prototype.roughBox = (width, height) => {
            const color = '#ededed';

            const box = RoughElement.create('rectangle').prop({
                size: { width, height },
                position: { x: 0, y: 0 },
                attrs: {
                    body: {
                        rough: {
                            hachureAngle: 70,
                            hachureGap: 20,
                            fillStyle: 'cross-hatch',
                        },
                        fill: color,
                        stroke: color,
                    },
                    border: false,
                },
            });
            box.set('movable', false);
            return box;
        };
    },
};
