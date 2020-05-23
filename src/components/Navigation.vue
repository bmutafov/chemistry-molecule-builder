<template>
    <nav>
        <router-link to="/">(admin) Molecules</router-link>
        <router-link to="/elements">(admin) Elements</router-link>
        <!-- <router-link to="/login">Login</router-link> -->
        <router-link to="/game/H2O">Game</router-link>
    </nav>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "Naviagtion"
});
</script>

<style scoped>
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
</style>