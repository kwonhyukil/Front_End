<template>
  <div class="loading-container">
    <h2>로그인 처리 중...</h2>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { onMounted } from "vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  console.log("✅ AuthCallback.vue 실행됨!");

  // 🔹 URL에서 토큰 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");

  console.log("📥 받은 JWT 토큰:", accessToken);

  // ✅ 토큰이 있다면 바로 저장
  if (accessToken && refreshToken) {
    console.log("✅ JWT 토큰을 저장하고 사용자 정보를 불러옵니다.");
    await authStore.handleAuthCallback(accessToken, refreshToken);
    router.push("/home"); // 홈 화면(또는 대시보드) 이동
    return;
  }

  // 코드가 있는지 확인
  const code = route.query.code;
  if (!code) {
    console.error("❌ Authorization code 없음");
    router.push("/login");
    return;
  }

  // 만약 백엔드에서 JSON으로 응답한다면, 아래 axios 요청으로 받아 처리
  console.error("❌ 현재 구조상, 백엔드에서 redirect로 토큰을 보낼 것이므로 이 부분은 실행 안됨");
  router.push("/login");
});
</script>
