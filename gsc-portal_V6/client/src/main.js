import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import GoogleLogin from "vue3-google-login";

const app = createApp(App);

app.use(createPinia()); // ✅ Pinia 연결
app.use(router);
app.use(GoogleLogin, {
  clientId:
    "803379862879-81pr5ku5kp12ndnb587vjh0ooppiut30.apps.googleusercontent.com",
});

app.mount("#app");
