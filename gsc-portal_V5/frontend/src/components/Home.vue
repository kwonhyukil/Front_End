<!-- 📁 [경로: frontend/src/pages/Home.vue] -->
<template>
  <div class="home-container">
    <h2>홈 화면</h2>
    <p v-if="user">👤 {{ user.name }} 님 환영합니다!</p>
    <p v-else>🔒 로그인 정보 없음</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../store/authStore.js";
import { jwtDecode } from "jwt-decode"; // ✅ 반드시 필요

const auth = useAuthStore();

onMounted(() => {
  const token = localStorage.getItem("token");

  console.log("🧩 저장된 token:", token);

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("✅ 디코딩 성공:", decoded);

      const userData = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
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
