<template>
    <button :class="['switch', active ? 'active' : 'inactive']" @click="click"> 
        <div class="img-holder">
            <img :src="img" />
        </div> 
        <span class="text">{{text}}</span>
    </button>
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
    border-radius: 3px;
    border: none;
    padding: 0;
    padding-right: 10px;
    outline: none;
    cursor: pointer;
    transition: 0.2s ease-out;
}

.switch:hover {
    filter: drop-shadow(0px 2px 2px rgb(121, 121, 121));
}

.switch .img-holder {
    background: rgb(228, 228, 228);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    margin-right: 10px;
    border-radius: 2px 0px 0 2px;
}

.switch .img-holder > img {
    width: 16px;
    height: 16px;
}

.switch.active {
    background: #209cfd;
    color: white;
    filter: drop-shadow(0px 2px 2px rgb(121, 121, 121));
}

.switch.active .img-holder {
    background: #0083e7;
}

.switch.active .img-holder > img {
    filter: invert(100%);
}

@media screen and (max-width: 600px) {
    .switch {
        padding: 0;
    }

    .switch span {
        display: none;
    }

    .switch .img-holder {
        margin: 0;
    }
}
</style>