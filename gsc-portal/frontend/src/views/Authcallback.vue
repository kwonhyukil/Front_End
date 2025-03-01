<template>
  <div>로그인 중입니다...</div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/authStore";
import { onMounted } from "vue";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  console.log("✅ AuthCallback.vue 실행됨!");

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  console.log("📥 받은 JWT 토큰:", token);

  if (token) {
    // ✅ JWT를 로컬스토리지에 저장
    localStorage.setItem("token", token);
    console.log("🎉 로그인 성공! JWT 저장 완료");

    if (token) {
    // ✅ JWT를 저장하고 사용자 정보 업데이트
    await authStore.handleAuthCallback(token);
  } else {
    console.error("❌ 로그인 실패: JWT 토큰 없음");
    router.push("/login");
  }
}});

</script>
