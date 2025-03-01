import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia"; // ✅ Pinia 추가

const app = createApp(App);
const pinia = createPinia(); // ✅ Pinia 인스턴스 생성

app.use(router);
app.use(pinia); // ✅ Pinia 등록

app.mount("#app");

console.log("✅ Vue 앱이 마운트되었습니다!");
