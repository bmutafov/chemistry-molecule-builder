<template>
    <div style="height: 100%">
        <div class="page">
            <div class="col">
                <div class="instructions">
                    <h3 class="fancy">Navigate</h3>
                </div>
                <Navigation />
                <CssLoader v-if="!elements" />
                <div v-else>
                    <div class="instructions">
                        <h3 class="fancy">Existing elements</h3>
                    </div>
                    <ul>
                        <li v-for="element in elements" :key="element.sign">
                            <!-- <img src="https://image.flaticon.com/icons/svg/341/341531.svg" /> -->
                            <span class="text-el">
                                <span class="text">
                                    <ElementPreview :bgColor="element.bgColor" :labelColor="element.labelColor">{{ element.sign }}</ElementPreview>
                                    <b>{{ element.name }}</b>
                                </span>
                                <img src="https://img.icons8.com/flat_round/52/000000/delete-sign.png" v-on:click="remove(element._id)" class="remove-butt" />
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col-2">
                <div class="page">
                    <div class="col-2" style="margin-right: 10px">
                        <h3 class="fancy">Add new element</h3>
                        <form id="login" @submit.prevent="submit">
                            <div style="display: flex; flex-direction: row">
                                <div style="display: flex; flex-direction: column; flex: 1; margin-left: 20px;" class="mrt-1">
                                    <span class="mrt-1 mrb-1">Background Color</span>
                                    <!-- <InputField label="Background Color" type="text" name="bgColor" placeholder="" v-model="bgColor.hex" style="flex: 4; margin-right: 10px" /> -->
                                    <Chrome-picker v-model="bgColor" />
                                </div>
                                <div style="display: flex; flex-direction: column; margin-left: 20px; flex: 1" class="mrt-1">
                                    <span class="mrt-1 mrb-1">Label Color</span>
                                    <!-- <InputField label="Label Color" type="text" name="labelColor" placeholder="" v-model="labelColor.hex" style="flex: 4; margin-right: 10px" /> -->
                                    <Chrome-picker v-model="labelColor" />
                                </div>
                                <div style="display: flex; flex-direction: column; flex: 3; margin-left: 20px;" class="mrt-1">
                                    <InputField label="Name" type="text" name="name" placeholder="" v-model="name" class="mrt-1" />
                                    <InputField label="Sign" type="text" name="sign" placeholder="" v-model="sign" class="mrt-1" />
                                    <RoughButton class="mrt-1" type="success"> Add element </RoughButton>
                                </div>
                            </div>
                            <!-- <compact-picker v-model="bgColor" />
                            <compact-picker v-model="labelColor" /> -->
                        </form>
                    </div>
                    <div class="col">
                        <h3 class="fancy" style="margin-left: 10px">Live preview</h3>
                        <ElementPreview :bgColor="this.bgColor.hex" :labelColor="this.labelColor.hex" :scale="3" class="element-preview">{{ this.sign }}</ElementPreview>
                        <div class="preview-name">{{ name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import InputField from './InputField.vue';
import RoughButton from './RoughButton.vue';
import Navigation from './Navigation.vue';
import ElementPreview from './ElementPreview.vue';
import { Chrome } from 'vue-color';

export default Vue.extend({
    components: {
        InputField,
        RoughButton,
        Navigation,
        ElementPreview,
        'Chrome-picker': Chrome,
    },
    data() {
        return {
            elements: [],
            message: '',
            name: 'Element',
            sign: 'E',
            bgColor: { hex: '#55FFBE' },
            labelColor: { hex: '#333333' },
            colors: '#000000',
        };
    },
    methods: {
        async remove(id) {
            const result = await this.$http.delete(`${this.$url}/api/element/${id}`, {
                headers: { 'auth-token': this.$cookies.get('auth-token') },
            });

            if (result.status >= 400) console.error('erorr', result);
            else this.elements = this.elements.filter(e => e._id !== id);
        },
        loggedInCookie() {
            return this.$cookies.get('auth-token') || false;
        },
        async retrieveData() {
            if (!this.loggedInCookie()) return false;

            const result = await this.$http.get(`${this.$url}/api/element`, {
                headers: { 'auth-token': this.$cookies.get('auth-token') },
            });
            if (result.status >= 400) return false;

            const data = result.data.data;
            return data;
        },

        async submit() {
            const { name, sign, bgColor, labelColor } = this;
            const result = await this.$http.post(
                `${this.$url}/api/element/`,
                {
                    name,
                    sign,
                    bgColor: bgColor.hex,
                    labelColor: labelColor.hex,
                },
                { headers: { 'auth-token': this.$cookies.get('auth-token') } }
            );
            if (result.code > 400) {
                this.message = 'Error, please try again';
            } else {
                this.elements.push(result.data.data);
                this.message = 'Element added!';
            }
        },
    },
    async beforeMount() {
        const data = await this.retrieveData();
        if (!data) {
            this.$router.push('/login');
            return;
        }
        this.elements = data;
    },
});
</script>

<style scoped>
.mrt-1 {
    margin-top: 10px;
}

.mrb-1 {
    margin-bottom: 10px;
}

.col ul li:hover .remove-butt {
    filter: grayscale(0);
    opacity: 1;
}

.text-el {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}

.text-el .text {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.remove-butt {
    filter: grayscale(100);
    cursor: pointer;
    margin-left: 5px;
    width: 16px;
    height: 16px;
    transition: 0.2 ease-in-out;
}

.remove-butt:hover {
    transform: scale(1.1);
}

.element-preview {
    margin: 50px auto;
}

.preview-name {
    display: flex;
    justify-content: center;
    margin-top: 60px;
    font-size: 2rem;
    font-weight: 700;
}
</style>
