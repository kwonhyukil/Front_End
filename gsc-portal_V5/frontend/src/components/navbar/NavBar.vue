<!-- [frontend/src/components/navbar/Navbar.vue] -->
<template>
  <header class="navbar">
    <div class="logo">GSC 포털</div>
    <nav>
      <ul class="nav-links">
        <li><router-link to="/home">홈</router-link></li>
        <li><router-link to="/schedule">시간표</router-link></li>
        <li><router-link to="/notice">공지사항</router-link></li>
        <li><router-link to="/calendar">학과 행사</router-link></li>
        <li v-if="authStore.isAdmin || authStore.isProfessor">
          <router-link to="/admin-approval">관리자 승인</router-link>
        </li>
      </ul>
    </nav>
    <div class="user-section">
      <span v-if="authStore.isAuthenticated">{{ authStore.user.name }}님</span>
      <button v-if="!authStore.isAuthenticated" @click="goLogin">로그인</button>
      <button v-else @click="goLogout">로그아웃</button>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from "../../store/authStore.js";
import { useRouter } from "vue-router";
export default {
  name: "Navbar",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const goLogin = () => router.push("/login");
    const goLogout = () => router.push("/logout");
    return { authStore, goLogin, goLogout };
  },
};
</script>

<style scoped>
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  position: fixed; top: 0; left: 0; right: 0;
  height: 60px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
}
.logo {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
.nav-links {
  display: flex; list-style: none; gap: 15px;
}
.nav-links a {
  color: #333; text-decoration: none;
  padding: 6px 10px;
  border-radius: 4px;
}
.nav-links a:hover {
  background: #f0f0f0;
}
.user-section {
  display: flex; align-items: center; gap: 10px;
}
body { padding-top: 60px; }
</style>
