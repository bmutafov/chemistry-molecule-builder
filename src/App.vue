<template>
    <div id="app">
        <nav>
            <router-link to="/">(admin) Molecules</router-link>
            <router-link to="/elements">(admin) Elements</router-link>
            <!-- <router-link to="/login">Login</router-link> -->
            <router-link to="/game/H2O">Game</router-link>
        </nav>

        <div class="container">
            <router-view />
        </div>
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

nav a {
    text-decoration: none;
    color: #ffffff;
    background: #44302f;
    box-shadow: 0px 2px 2px #cfcfcf;
    padding: 15px;
    border-radius: 10px;
    margin-left: 5px;
}

nav a:hover {
    background: #684e4c;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f8f8f8;
    padding: 15px;
    border-radius: 15px;
    width: 900px;
    margin: 50px auto;
    box-shadow: 0px 1px 3px #ccc;
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
