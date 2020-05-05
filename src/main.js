import Vue from 'vue';
import App from './App.vue';
import router from './router';
import RappidPlugin from '@/plugins/rappid';
import Config from './plugins/config';

Vue.use(RappidPlugin);
Vue.use(Config);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
