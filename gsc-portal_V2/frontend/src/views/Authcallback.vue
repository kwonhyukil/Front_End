<template>
  <div class="loading-container">
    <h2>로그인 처리 중...</h2>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { onMounted } from "vue";
import axios from "axios";

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

  // ✅ 이미 백엔드에서 토큰이 전달된 경우 처리
  if (accessToken && refreshToken) {
    console.log("✅ JWT 토큰을 저장하고 사용자 정보를 불러옵니다.");

    // ✅ 로컬 스토리지에 저장
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // ✅ 사용자 정보 불러오기
    await authStore.handleAuthCallback(accessToken, refreshToken);
    router.push("/dashboard"); // ✅ 로그인 성공 후 대시보드 이동
    return;
  }

   // ✅ 백엔드에서 직접 이동하지 않은 경우, 수동으로 API 호출
   const code = route.query.code;
  if (!code) {
    console.error("❌ Authorization code 없음");
    router.push("/login");
    return;
  }

  try {
    console.log("📤 Google OAuth 코드 백엔드로 전송 중...");
    const response = await axios.get(
      import.meta.env.VITE_BACKEND_URL + `/auth/google/callback?code=${code}`
    );
    console.log("📥 백엔드 응답:", response.data);

    // ✅ 신규 사용자인 경우 회원가입 페이지로 이동
    if (response.data.redirect) {
      console.warn("🔄 신규 사용자, 회원가입 페이지로 이동:", response.data.redirect);
      router.push(response.data.redirect);
      return;
    }

    // ✅ 기존 회원이라면 JWT 토큰 저장 후 대시보드로 이동
    accessToken = response.data.accessToken;
    refreshToken = response.data.refreshToken;

    if (!accessToken || !refreshToken) {
      console.error("❌ 받은 JWT 토큰이 유효하지 않음!");
      router.push("/login");
      return;
    }

    console.log("✅ JWT 토큰 수신 완료:", accessToken);

    // ✅ 로컬 스토리지에 저장
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // ✅ 비동기 처리 완료 후 대시보드로 이동
    await authStore.handleAuthCallback(accessToken, refreshToken);
    router.push("/dashboard");
  } catch (error) {
    console.error("❌ AuthCallback 오류:", error);
    router.push("/login"); // 실패 시 로그인 페이지로 이동
  }
});
</script>
