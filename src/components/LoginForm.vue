<template>
    <div class="login-form">
        <form id="login" @submit.prevent="signIn">
            <input
                type="text"
                name="username"
                placeholder="Username"
                v-bind:class="{ 'error-field': errors.username }"
                v-model="username"
            />
            <span class="invalid-field" v-if="errors.username">
                {{ errors.username }}
            </span>
            <span class="empty-row" v-else></span>
            <input
                type="password"
                name="password"
                placeholder="Password"
                v-bind:class="{ 'error-field': errors.password }"
                v-model="password"
            />
            <span class="invalid-field" v-if="errors.password">
                {{ errors.password }}
            </span>
            <span class="empty-row" v-else></span>
            <button>Sign In</button>
        </form>
    </div>
</template>

<script>
import Vue from 'vue';

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

export default {
    name: 'LoginForm',
    data() {
        return {
            username: '',
            password: '',
            errors: {},
        };
    },
    methods: {
        async signIn() {
            const { username, password } = this;
            const response = await this.$http.post(
                `${this.$url}/api/user/login`,
                { username, password },
                { validateStatus: false }
            );
            const { data: result } = response;

            if (result.error || response.status >= 400) {
                this.errors = {};
                result.data.forEach(err => {
                    this.errors[err.context] = err.message
                        .replace(/"/g, '')
                        .capitalize();
                });
            } else {
                this.errors = {};
                Vue.$cookies.set('auth-token', result.data.token);
            }
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.empty-row,
.invalid-field {
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form {
    width: 40%;
    margin: 100px auto;
}

.login-form form {
    display: flex;
    flex-direction: column;
}

input[type='text'],
input[type='password'] {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

input[type='text']:focus,
input[type='password']:focus {
    outline: none;
    border: 1px solid #9e9e9e;
}

.error-field {
    border: 1px solid red !important;
    color: red;
}
</style>
