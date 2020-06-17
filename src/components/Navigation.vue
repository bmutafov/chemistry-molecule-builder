<template>
    <nav>
        <router-link to="/">Molecules</router-link>
        <router-link to="/elements">Elements</router-link>
        <!-- <router-link to="/login">Login</router-link> -->
        <router-link to="/game/H2O">Game</router-link>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: 'Naviagtion',
});
</script>

<style scoped>
nav {
    margin-top: 30px;
}
nav a {
    text-decoration: none;
    color: #ffffff;
    background: #5f91ff;
    box-shadow: 0px 2px 2px #cfcfcf;
    padding: 15px;
    border-radius: 10px;
    margin: 5px;
}

nav a:hover {
    background: #4d85fd;
}
</style>
