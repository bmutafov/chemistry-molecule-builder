<template>
    <button class="submit-butt" @click="submit">
        Submit
    </button>
</template>

<script>
export default {
    name: 'DoneButton',
    methods: {
        submit() {
            this.$emit('submit');
        },
    },
};
</script>

<style scoped>
.submit-butt {
    font-family: Ensimmainen, fantasy;
    font-weight: 600;
    padding: 15px 50px;
    background: #6eff6b;
    color: black;
    font-size: 2rem;
    border-radius: 5px;
    border: none;
    box-shadow: 3px 3px 0px #429641;
    outline: none;
    cursor: pointer;
    transition: 100ms ease-out;
    position: relative;
    top: 0;
    left: 0;
}

.submit-butt:hover {
    background: #9bfa9a;
    box-shadow: 2px 2px 0px #429641;
    top: 1;
    left: 1;
}

.submit-butt:active {
    background: #3caa3a;
    box-shadow: none;
    top: 3px;
    left: 3px;
}
</style>
