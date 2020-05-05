import config from '../config/config.json';

export default {
    install: function(Vue) {
        Vue.prototype.config = config;
    },
};
