// 📁 [경로: frontend/src/main.js]
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import { createPinia } from "pinia";
import "./styles/main.css"; // 필요하다면

const app = createApp(App);
app.use(createPinia()); // ✅ Pinia 먼저 등록
app.use(router);
app.mount("#app");
