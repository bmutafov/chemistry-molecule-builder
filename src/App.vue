<template>
    <div id="app">
        <LoginForm />
    </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
import VueCookies from 'vue-cookies';

Vue.use(VueCookies);
Vue.$cookies.config('7d');

Vue.prototype.$http = axios;
Vue.prototype.$url = 'http://localhost:3000';

import LoginForm from './components/LoginForm.vue';

export default {
    name: 'App',
    components: {
        LoginForm,
    },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
