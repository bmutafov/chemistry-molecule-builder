<template>
    <ul>
        <li><img src="https://image.flaticon.com/icons/png/512/883/883026.png" /><router-link to="/">Molecules</router-link></li>
        <li><img src="https://image.flaticon.com/icons/svg/341/341531.svg" /><router-link to="/elements"> Elements</router-link></li>
        <!-- <router-link to="/login">Login</router-link> -->
        <li><img src="https://image.flaticon.com/icons/svg/3079/3079017.svg" /><router-link to="/game/H2O">Game</router-link></li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    name: 'Naviagtion',
});
</script>

<style scoped>
a {
    color: #222;
    font-weight: 600;
}
</style>
