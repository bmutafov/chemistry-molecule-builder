import Vue from 'vue';
import App from './App.vue';
import router from './router';
import RappidPlugin from '@/plugins/rappid';
import Config from './plugins/config';
import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.use(VueSweetalert2);
Vue.use(RappidPlugin);
Vue.use(Config);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
