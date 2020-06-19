<template>
    <button :class="['butt', type]" @click="submit">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "RoughButton",
    props: {
        type: {
            type: String,
            default: "success"
        }
    },
    methods: {
        submit() {
            this.$emit("submit");
        }
    }
};
</script>

<style scoped>
.butt {
    font-family: Ensimmainen, fantasy;
    font-weight: 600;
    padding: 15px 20px;
    font-size: 2rem;
    border-radius: 5px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: 100ms ease-out;
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
}

.butt:hover {
    top: 1;
    left: 1;
}

.butt:active {
    box-shadow: none;
    top: 3px;
    left: 3px;
}

.butt > img {
    width: 24px;
    height: 24px;
    margin-right: 15px;
}

.error {
    background: #ff4444;
    box-shadow: 3px 3px 0px #bd2121;
    color: white;
}

.error:hover {
    background: #ff6969;
    box-shadow: 2px 2px 0px #bd2121;
}

.error:active {
    background: #bd2121;
}

.error > img {
    filter: invert(100%);
}

.success {
    background: #6eff6b;
    color: black;
    box-shadow: 3px 3px 0px #429641;
}

.success:hover {
    background: #9bfa9a;
    box-shadow: 2px 2px 0px #429641;
}

.success:active {
    background: #3caa3a;
}

.warning {
    background: #fae674;
    color: black;
    box-shadow: 3px 3px 0px #c2af47;
}

.warning:hover {
    background: #ffef96;
    box-shadow: 2px 2px 0px #c2af47;
}

.warning:active {
    background: #c2af47;
}
</style>
