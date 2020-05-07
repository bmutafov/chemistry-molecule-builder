<template>
    <div id="app">
        <nav>
            <router-link to="/">Edit molecules</router-link> |
            <router-link to="/elements">Edit Elements</router-link> |
            <router-link to="/login">Login</router-link> |
            <router-link to="/game">Game</router-link> |
        </nav>

        <router-view />
    </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);
Vue.$cookies.config("7d");

Vue.prototype.$http = axios;
Vue.prototype.$url = "http://localhost:3000";

export default {
    name: "App"
};
</script>

<style>
@font-face {
    font-family: Ensimmainen;
    src: url("../public/fonts/Ensimmainen.ttf");
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
