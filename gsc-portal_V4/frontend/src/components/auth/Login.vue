<template>
  <div class="login-container">
    <h2>Google 로그인</h2>
    <button @click="loginWithGoogle">Google로 로그인</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../store/authStore.js";
import { useUserStore } from "../../store/userStore.js";

export default {
  name: "Login",
  setup() {
    const route = useRoute(); // 현재 라우트 정보 가져오기
    const router = useRouter(); // 페이지 이동을 위한 Vue Router 사용
    const authStore = useAuthStore(); // 인증 상태 관리 (Pinia Store)
    const userStore = useUserStore(); // 사용자 정보 관리 (Pinia Store)
    const token = ref(route.query.token || ""); // URL에서 `token` 파라미터 가져오기

    // ✅ 컴포넌트 마운트 시 토큰이 있으면 자동 로그인 처리
    onMounted(async () => {
      if (token.value) {
        // 1️⃣ 토큰 저장
        authStore.setToken(token.value);
        // 2️⃣ 사용자 프로필 로드
        await userStore.loadProfile(token.value);
        authStore.setUser(userStore.profile);
        // 3️⃣ 로그인 후 홈(`/home`)으로 이동
        router.push("/home");
      }
    });

    // ✅ Google OAuth 로그인 요청
    const loginWithGoogle = () => {
      const backendURL = import.meta.env.VITE_BACKEND_URL; // 환경 변수에서 백엔드 URL 가져오기
      window.location.href = `${backendURL}/auth/google`; // Google 로그인 요청
    };

    return { token, loginWithGoogle };
  },
};
</script>

<style scoped>
/* 로그인 화면 스타일 */
.login-container {
  margin-top: 100px;
  text-align: center;
}
</style>
