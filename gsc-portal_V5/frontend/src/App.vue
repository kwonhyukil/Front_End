<!-- 📁 [경로: frontend/src/App.vue] -->
<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "./store/authStore.js";

axios.defaults.withCredentials = true; // 🔑 refreshToken 쿠키 전송 허용

const auth = useAuthStore();

// ✅ 새로고침 시 localStorage 복원
// ✅ refreshToken 쿠키가 있으면 /api/refresh로 accessToken 재발급
const restoreAccessToken = async () => {
  if (!auth.token) {
    // 로컬에 accessToken이 없을 때만 재발급 시도
    try {
      const { data } = await axios.post("http://localhost:8080/api/refresh");
      // data: { accessToken: "새로운 토큰" }
      // user 정보까지 받으려면 별도 API 필요
      localStorage.setItem("token", data.accessToken);
      auth.token = data.accessToken;
      console.log("✅ 자동 로그인(재발급) 성공:", data.accessToken);
    } catch (err) {
      console.warn("❌ 자동 로그인 실패:", err);
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
