<template>
  <div class="container">
    <h2>Sign In</h2>
    <form id="login" @submit.prevent="signIn">
      <InputField
        label="Username"
        type="text"
        name="username"
        placeholder=""
        v-model="username"
        class="mrt-1"
      />
      <InputField
        label="Password"
        type="password"
        name="password"
        placeholder=""
        v-model="password"
        class="mrt-1"
      />
      <Button class="mrt-1">Sign In</Button>
    </form>
  </div>
</template>

<script>
import Vue from "vue";
import InputField from "./InputField.vue";
import Button from "./Button.vue";

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

export default {
  name: "LoginForm",
  components: {
    InputField,
    Button
  },
  data() {
    return {
      username: "",
      password: "",
      errors: {}
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
          this.errors[err.context] = err.message.replace(/"/g, "").capitalize();
        });
      } else {
        this.errors = {};
        Vue.$cookies.set("auth-token", result.data.token);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 300px;
  margin: 100px auto;
  text-align: left;
  background: rgb(255, 252, 240);
  padding: 20px;
  border: 2px dotted rgb(219, 224, 193);
  border-radius: 15px;
}

.mrt-1 {
  margin-top: 10px;
}
</style>
