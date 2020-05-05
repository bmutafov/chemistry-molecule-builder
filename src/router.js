import Vue from 'vue';
import Router from 'vue-router';

import LoginForm from './components/LoginForm.vue';
import ListMolecules from './components/ListMolecules.vue';
import GameLevel from './components/GameLevel.vue';

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
            path: '/game',
            name: 'Game',
            component: GameLevel,
        },
    ],
});
