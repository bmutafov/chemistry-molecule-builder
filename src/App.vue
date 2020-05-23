<template>
    <div id="app">
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
Vue.prototype.$url =
    process.env.NODE_ENV === "production"
        ? "https://chem-proto-1.herokuapp.com/"
        : "http://localhost:3000";

export default {
    name: "App"
};
</script>

<style>
@font-face {
    font-family: Ensimmainen;
    src: url("../public/fonts/Ensimmainen.ttf");
}

body {
    margin: 0;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
</style>
