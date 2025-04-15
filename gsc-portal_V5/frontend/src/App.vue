<!-- 📁 [경로: frontend/src/App.vue] -->
<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./store/authStore";
import NavBar from "./components/navbar/NavBar.vue";

const auth = useAuthStore();

onMounted(async () => {
  auth.restore();

  // 👉 token 있으면 사용자 정보 요청
  let accessToken = auth.token;
  if (!accessToken) {
    accessToken = await auth.restoreAccessToken();
  }

  if (accessToken) {
    await auth.fetchUserProfile();
  }
});
</script>

<style>
/* 필요 시 */
</style>
