<template>
  <div class="input-container">
    <label>{{ label }}</label>
    <input
      v-bind:type="type"
      class="input-field"
      v-bind:name="name"
      v-bind:placeholder="placeholder"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    name: "InputField",
    props: {
        value: String,
        label: String,
        type: String,
        name: String,
        placeholder: String
    }
});
</script>

<style scoped>
.input-container {
    display: flex;
    flex-direction: column;
}

.input-field {
    background: #fcfcfc;
    border-radius: 5px;
    padding: 10px;
    font-size: 1.2em;
    border: 2px solid #c5c5c5;
    margin: 5px 0 0 0;
    transition: 0.2s ease-out;
}

.input-field:hover {
    background: #ffffff;
    border: 2px solid #2fd0cc;
}

.input-field:focus {
    border: 2px solid #2fd0cc;
    background: #ffffff;
    outline: none;
    box-shadow: 0px 3px 3px #9c9c9c;
}
</style>