<template>
  <div class="navbar">
    <!-- 🔹 로고 -->
    <div class="logo">GSC 포털</div>

    <!-- 🔹 네비게이션 메뉴 -->
    <ul class="nav-links">
      <li><router-link to="/home">홈</router-link></li>
      <li><router-link to="/schedule">시간표</router-link></li>
      <li><router-link to="/notice">공지사항</router-link></li>
      <!-- ✅ 관리자(1), 교수(2)만 관리자 승인 페이지 접근 가능 -->
      <li v-if="authStore.isAdmin || authStore.isProfessor">
        <router-link to="/admin-approval">관리자 승인</router-link>
      </li>
    </ul>

    <!-- 🔹 로그인/로그아웃 섹션 -->
    <div class="auth-section">
      <span v-if="authStore.isAuthenticated">
        {{ authStore.user.name }}님
      </span>
      <button v-if="!authStore.isAuthenticated" @click="goLogin" class="login-btn">
        로그인
      </button>
      <button v-else @click="goLogout" class="logout-btn">
        로그아웃
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "../../store/authStore.js"; // Pinia 상태 관리
import { useRouter } from "vue-router";

export default {
  name: "Navbar",
  setup() {
    const authStore = useAuthStore(); // 인증 상태 관리
    const router = useRouter(); // 페이지 이동을 위한 Vue Router 사용

    // ✅ 로그인 페이지 이동
    const goLogin = () => router.push("/login");

    // ✅ 로그아웃 페이지 이동
    const goLogout = () => router.push("/logout");

    return { authStore, goLogin, goLogout };
  },
};
</script>

<style scoped>
/* 🔹 네비게이션 바 스타일 */
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: #0787e1;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 999;
}

/* 🔹 로고 스타일 */
.logo {
  font-size: 20px;
  font-weight: bold;
}

/* 🔹 네비게이션 링크 스타일 */
.nav-links {
  display: flex;
  gap: 15px;
  list-style: none;
}
.nav-links a {
  color: #fff;
  text-decoration: none;
}

/* 🔹 로그인/로그아웃 버튼 스타일 */
.auth-section {
  display: flex;
  gap: 10px;
  align-items: center;
}
.login-btn,
.logout-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: #fff;
}
.login-btn { background: #005bbb; }
.logout-btn { background: #ff4d4d; }

/* 🔹 전체 페이지의 마진을 네비게이션 바 높이에 맞춤 */
body {
  margin: 0;
  padding-top: 60px; /* 네비게이션 바 높이 */
}
</style>
