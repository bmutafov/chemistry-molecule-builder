import Vue from 'vue';
import Router from 'vue-router';

import LoginForm from './components/LoginForm.vue';
import ListMolecules from './components/ListMolecules.vue';
import Game from './components/Game.vue';
import AddElements from './components/AddElements.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: ListMolecules,
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginForm,
        },
        {
            path: '/game/:formula',
            name: 'Game',
            component: Game,
        },
        {
            path: '/elements',
            name: 'Elements',
            component: AddElements,
        },
    ],
});
