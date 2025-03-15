// 📂 frontend/src/main.js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./assets/style.css";
import { useAuthStore } from "./store/authStore";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");

const authStore = useAuthStore();
authStore.restoreUser(); // ✅ 새로고침 후 로그인 유지
