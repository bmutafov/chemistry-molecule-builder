<template>
  <button class="btn"><slot></slot></button>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Button"
});
</script>

<style scoped>
.btn {
  padding: 10px 25px;
  background: rgb(77, 148, 255);
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 5px;
}

.btn:hover {
  background: rgb(51, 102, 179);
}
</style>