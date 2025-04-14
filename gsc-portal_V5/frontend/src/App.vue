<!-- 📁 [경로: frontend/src/App.vue] -->
<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "./store/authStore.js";
import NavBar from "./components/navbar/NavBar.vue"

axios.defaults.withCredentials = true; // 🔑 refreshToken 쿠키 전송 허용

const auth = useAuthStore();

// ✅ 새로고침 시 localStorage 복원
// ✅ refreshToken 쿠키가 있으면 /api/refresh로 accessToken 재발급
const restoreAccessToken = async () => {
  if (!auth.token) {
    try {
      const res = await axios.post("http://localhost:8080/api/refresh");
      const accessToken = res.data.accessToken;
      localStorage.setItem("token", accessToken);
      auth.token = accessToken;
      console.log("✅ accessToken 재발급 성공");
    } catch (e) {
      console.warn("❌ accessToken 재발급 실패", e);
      auth.clearAuth();
    }
  }
};


onMounted(async () => {
  // 1) 로컬 스토리지로부터 상태 복원
  auth.restore();

  // 2) refresh 쿠키 → /api/refresh → 새 accessToken 발급
  await restoreAccessToken();
});
</script>

<style>
/* 필요 시 */
</style>
