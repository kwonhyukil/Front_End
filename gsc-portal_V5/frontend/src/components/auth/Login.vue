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
  window.location.href = `${BACKEND_URL}/auth/google`;
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
