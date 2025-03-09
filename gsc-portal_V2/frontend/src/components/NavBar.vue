<!-- frontend/src/components/NavBar.vue -->
<template>
  <div class="navbar">
    <div class="logo">GSC_PORTAL</div>
    <ul class="nav-links">
      <li><router-link to="/home">홈</router-link></li>
      <li><router-link to="/schedule">시간표</router-link></li>
      <li><router-link to="/notices">공지사항</router-link></li>
      <li><router-link to="/events">학과 행사</router-link></li>
      <li v-if="isAdmin"><router-link to="/admin">관리자 승인</router-link></li>
    </ul>
    <div class="auth-section">
      <span v-if="user">{{ user.name }}님</span>
      <button v-if="!user" @click="loginWithGoogle">로그인</button>
      <button v-else @click="logout">로그아웃</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const isAdmin = computed(() => user.value?.role === "관리자" || user.value?.role === "교수");

const loginWithGoogle = () => {
  authStore.loginWithGoogle();
};

const logout = () => {
  authStore.logout();
};
</script>

<style scoped>
/* ✅ 상단 고정 및 스타일 개선 */
.navbar {
  position: fixed; /* 📌 상단 고정 */
  top: 0;
  left: 0;
  width: 100%; /* ✅ 전체 너비 차지 */
  height: 60px; /* ✅ 네비게이션 바 높이 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #0787e1; /* ✅ 어두운 색 배경 */
  color: white;
  z-index: 1000;
}

/* ✅ 로고 */
.logo {
  font-size: 20px;
  font-weight: bold;
}

/* ✅ 네비게이션 메뉴 */
.nav-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 20px;
}

.nav-links li {
  font-size: 16px;
}

.nav-links a {
  text-decoration: none;
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ✅ 로그인/로그아웃 버튼 */
.auth-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login-btn, .logout-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
}

.logout-btn {
  background: #ff4d4d;
}

.login-btn:hover {
  background: #0056b3;
}

.logout-btn:hover {
  background: #cc0000;
}

/* ✅ 본문이 네비게이션 바 아래에서 시작되도록 설정 */
body {
  padding-top: 70px; /* ✅ 네비게이션 바 높이만큼 본문 내려가게 */
}
</style>