<template>
  <div class="login-container">
    <h1 class="title">GSC PORTAL</h1>
    <button class="google-login-btn" @click="loginWithGoogle">
      GSC PORTAL 로그인
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();

// ✅ Google OAuth 로그인 요청
const loginWithGoogle = () => {
  authStore.loginWithGoogle();
};
</script>

<style scoped>
/* ✅ 전체 화면을 채우는 로그인 컨테이너 */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}

/* ✅ GSC PORTAL 타이틀 스타일 */
.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* ✅ Google 로그인 버튼 스타일 */
.google-login-btn {
  display: flex;
  align-items: center;
  background-color: #4285f4;
  color: white;
  font-size: 18px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.google-login-btn:hover {
  background-color: #357ae8;
}

/* ✅ Google 아이콘 스타일 */
.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
</style>
