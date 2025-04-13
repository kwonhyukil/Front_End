<!-- [경로: frontend/src/components/auth/Login.vue] -->
<template>
  <div class="login-container">
    <h2>로그인</h2>
    <div v-if="error" class="error-message">{{ getErrorMessage(error) }}</div>
    <button @click="handleGoogleLogin" class="google-login-button">
      Google로 로그인
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const error = ref(null);
const BACKEND_URL = 'http://localhost:8080';

const handleGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};

const getErrorMessage = (error) => {
  switch (error) {
    case 'authentication_failed':
      return '인증에 실패했습니다.';
    case 'no_user_data':
      return '사용자 정보를 가져올 수 없습니다.';
    default:
      return '로그인 중 오류가 발생했습니다.';
  }
};

onMounted(() => {
  // URL에서 에러 파라미터 확인
  const urlParams = new URLSearchParams(window.location.search);
  error.value = urlParams.get('error');

  // 구글 콜백에서 /login?token=... 으로 리다이렉트 했다면
  const token = urlParams.get('accessToken');
  console.log("✅ 리다이렉트용 accessToken:", accessToken);  // 디버그 출력 추가

  if (token) {
  // ✅ 저장 먼저 하고
    localStorage.setItem("token", token);

    // ✅ 저장 직후 이동 → 리렌더링 발생 방지 위해 setTimeout
    setTimeout(() => {
      window.history.replaceState({}, "", "/home");
      window.location.reload(); // 또는 router.replace("/home") 사용
    }, 100); // 저장 보장
  } else {
  console.warn("⚠️ 토큰이 URL에 없음");
}
});
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}
.google-login-button {
  display: inline-block;
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}
.google-login-button:hover {
  background-color: #357abd;
}
.error-message {
  color: red;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>
