<!-- [frontend/src/App.vue] -->
<template>
  <!-- 전역 네비게이션 -->
  <NavBar />
  <!-- 라우터 뷰 -->
  <router-view />
</template>

<script>
import { onMounted } from "vue";
import NavBar from "./components/navbar/Navbar.vue";
import { useAuthStore } from "./store/authStore";
import axios from "axios";

export default {
  name: "App",
  components: { NavBar },
  setup() {
    const authStore = useAuthStore();

    const checkSession = async () => {
      try {
        const response = await axios.get("/auth/check-session", {
          withCredentials: true
        });
        
        if (response.data.isAuthenticated) {
          authStore.setUser(response.data.user);
        }
      } catch (error) {
        console.error("세션 체크 실패:", error);
      }
    };

    onMounted(() => {
      checkSession();
    });
  }
};
</script>

<style>
/* 별도 스타일은 main.css */
</style>
