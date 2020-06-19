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
        ? "https://chemistry-api.azurewebsites.net"
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

body,
html {
    height: 100%;
    margin: 0;
    font-family: Helvetica, Arial, sans-serif;
}

#app {
    height: 100%;
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>
