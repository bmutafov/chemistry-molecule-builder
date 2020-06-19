<template>
    <div class="element" :style="`background: ${this.bgColor}; color: ${this.labelColor}; transform: scale(${this.scale})`"><slot></slot></div>
</template>

<script>
export default {
    name: "ElementPreview",
    props: {
        bgColor: String,
        labelColor: String,
        scale: {
            type: Number,
            default: 1
        }
    }
};
</script>

<style scoped>
.element {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #222;
}
</style>