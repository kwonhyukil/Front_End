// 📄 main.js
/*
  Vue 초기화, Pinia, Vue Router 등록
*/
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import { createPinia } from "pinia";
import "./styles/main.css"; // 메인 CSS (디자인)

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
