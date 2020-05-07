<template>
    <div>
        <div class="add">
            {{ message }}
            <form id="login" @submit.prevent="submit">
                <InputField
                    label="Name"
                    type="text"
                    name="name"
                    placeholder=""
                    v-model="name"
                    class="mrt-1"
                />
                <InputField
                    label="Sign"
                    type="text"
                    name="sign"
                    placeholder=""
                    v-model="sign"
                    class="mrt-1"
                />
                <InputField
                    label="Background Color"
                    type="text"
                    name="bgColor"
                    placeholder=""
                    v-model="bgColor"
                    class="mrt-1"
                />
                <InputField
                    label="Label Color"
                    type="text"
                    name="labelColor"
                    placeholder=""
                    v-model="labelColor"
                    class="mrt-1"
                />
                <Button class="mrt-1">Add</Button>
            </form>
        </div>
        <div class="list-elements">
            <h3>Existing elements:</h3>
            <ul>
                <li
                    v-for="element in elements"
                    :key="element.sign"
                    class="mrt-1"
                >
                    {{ element.name }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import InputField from "./InputField.vue";
import Button from "./Button.vue";

export default Vue.extend({
    components: {
        InputField,
        Button
    },
    data() {
        return {
            elements: [],
            message: "",
            name: "",
            sign: "",
            bgColor: "",
            labelColor: ""
        };
    },
    methods: {
        loggedInCookie() {
            return this.$cookies.get("auth-token") || false;
        },
        async retrieveData() {
            if (!this.loggedInCookie()) return false;

            const result = await this.$http.get(`${this.$url}/api/element`, {
                headers: { "auth-token": this.$cookies.get("auth-token") }
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
                    bgColor,
                    labelColor
                },
                { headers: { "auth-token": this.$cookies.get("auth-token") } }
            );
            if (result.code > 400) {
                this.message = "Error, please try again";
            } else {
                this.elements.push(result.data.data);
                this.message = "Element added!";
            }
        }
    },
    async beforeMount() {
        const data = await this.retrieveData();
        if (!data) {
            this.$router.push("/login");
            return;
        }
        console.log(data);
        this.elements = data;
    }
});
</script>

<style scoped>
.add {
    width: 500px;
    margin: 100px auto;
    background: #ffe2ee;
    padding: 15px;
    border-radius: 15px;
}

.list-elements {
    width: 500px;
    margin: 20px auto;
    background: #ffcee2;
    padding: 15px;
    border-radius: 15px;
}

.list-elements ul {
    list-style-type: none;
}

.list-elements ul li {
    text-align: center;
}

.mrt-1 {
    margin-top: 10px;
}
</style>