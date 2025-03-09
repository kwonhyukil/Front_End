<template>
    <div class="navbar">
      <div class="logo">GSC_PORTAL</div>
      <ul class="nav-links">
        <li><router-link to="/">홈</router-link></li>
        <li><router-link to="/schedule">시간표</router-link></li>
        <li><router-link to="/notices">공지사항</router-link></li>
        <li v-if="user?.role === 'admin'"><router-link to="/admin">관리자 페이지</router-link></li>
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

const loginWithGoogle = () => {
  authStore.loginWithGoogle();
};

const logout = () => {
  authStore.logout();
};

</script>

<style scoped>
/* 네비게이션 바 스타일 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #007bff;
  color: white;
  z-index: 1000;
}

/* 로고 */
.logo {
  font-size: 25px;
  font-weight: bold;
}

/* 네비게이션 메뉴 */
.nav-links {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 100px;
}

.nav-links li {
  font-size: 16px;
}

/* 로그인/로그아웃 버튼 */
.user-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding-right: 20px;
}

/* 로그인 버튼 */
.login-btn {
  background: white;
  color: #007bff;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  min-width: 80px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.login-btn:hover {
  background: #f0f0f0;
}

/* 사용자 정보 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 프로필 이미지 */
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

/* 로그아웃 버튼 */
.logout-btn {
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: #cc0000;
}

/* 본문이 네비바 아래에서 시작되도록 설정 */
body {
  padding-top: 70px;
}
</style>
