import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia()); // ✅ Pinia 등록
app.use(router);        // ✅ Vue Router 등록

app.mount('#app');
