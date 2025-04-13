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

const auth = useAuthStore();

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("accessToken");
  const name = params.get("name"); // 백엔드에서 넘겨줄 수 있음

  // ✅ 만약 백엔드가 user도 함께 쿼리스트링으로 보낸다면:
  //    ex) &name=홍길동&role=2 ...
  //    setAuth({ name, role: 2, ... }, token)
  if (token) {
    // 여기서는 user info를 별도 API로 얻거나, JWT 디코딩해서 얻는 방식
    // 간단히 예시로:
    const userData = {
      name: name || "GoogleUser", 
      role: 2, 
    };
    auth.setAuth(userData, token);
    // URL 정리
    window.history.replaceState({}, "", "/home");
  }
});
</script>

<style scoped>
.home-container {
  padding: 2rem;
}
</style>
