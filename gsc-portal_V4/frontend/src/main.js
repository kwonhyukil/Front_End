// 📄 main.js
/*
  Vue 초기화, Pinia, Vue Router 등록
*/
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import { createPinia } from "pinia";

// Pinia & Router 등록
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
