<!-- 📁 [경로: frontend/src/pages/Home.vue] -->
<template>
  <div class="home-container">
    <h2>홈 화면</h2>
    <p v-if="!auth.isReady">⏳ 로그인 정보 확인 중...</p>
    <p v-if="auth.user">👤 {{ auth.user.name }} 님 환영합니다!</p>
    <p v-else>🔒 로그인 정보 없음</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/authStore.js";

const auth = useAuthStore();

onMounted(() => {
  auth.restore();
  
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);

      const userData = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role_id: decoded.role, // 👈 role_id로 저장될 수 있으니 확인 필요
      };

      auth.setAuth(userData, token);
    } catch (e) {
      console.error("❌ JWT 디코딩 실패:", e.message);
    }
  } else {
    console.warn("⚠️ localStorage에 token 없음");
  }
});
</script>

<style scoped>
.home-container {
  padding: 2rem;
}
</style>
