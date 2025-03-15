<template>
  <div class="logout-container">
    <h2>로그아웃 중...</h2>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { logoutRequest } from "../../api/auth.js";
import { useRouter } from "vue-router";

export default {
  name: "Logout",
  setup() {
    const authStore = useAuthStore(); // Pinia 인증 상태 관리
    const router = useRouter(); // 페이지 이동을 위한 Vue Router 사용

    // ✅ 컴포넌트 마운트 시 자동 로그아웃 실행
    onMounted(async () => {
      if (authStore.isAuthenticated) {
        try {
          // 1️⃣ 백엔드 로그아웃 요청
          await logoutRequest(authStore.token);
        } catch (error) {
          console.error("로그아웃 요청 오류:", error);
        }
      }
      // 2️⃣ 인증 정보 초기화 (Pinia Store에서 토큰 및 사용자 정보 삭제)
      authStore.logout();
      // 3️⃣ 로그인 페이지(`/login`)로 이동
      router.push("/login");
    });
  },
};
</script>

<style scoped>
/* 로그아웃 화면 스타일 */
.logout-container {
  margin-top: 100px;
  text-align: center;
}
</style>
