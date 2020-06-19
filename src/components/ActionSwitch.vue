<template>
    <button :class="['switch', active ? 'active' : 'inactive']" @click="click"> <img :src="img" /> {{text}} </button>
</template>

<script>
export default {
    name: "ActionSwitch",
    props: {
        action: String,
        active: Boolean,
        img: String,
        text: String
    },
    methods: {
        click() {
            this.$emit("actionChange", this.action);
        }
    }
};
</script>

<style scoped>
.switch {
    height: 30px;
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.switch > img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
}

.switch.active {
    background: red;
}

.switch.inactive {
    background: blue;
}
</style>