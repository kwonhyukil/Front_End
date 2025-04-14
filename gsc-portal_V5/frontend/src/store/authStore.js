// 📁 [경로: frontend/src/store/authStore.js]
import { defineStore } from "pinia";
import { ref, computed } from "vue"; // npm install jwt-decode

export const useAuthStore = defineStore("auth", () => {
  // 🔑 상태
  const token = ref(localStorage.getItem("token") || null); // AccessToken
  const user = ref(JSON.parse(localStorage.getItem("user") || null));
  const isAuthenticated = ref(!!token.value);
  const isAdmin = computed(() => user.value?.role === 1);
  const isProfessor = computed(() => user.value?.role === 2);

  // ✅ 로그인 시 (Google OAuth 콜백이 /home?accessToken=... 로 오면 처리)
  //    userData: { id, name, email, role } (백엔드에서 JWT에 담거나 별도 API로 받아올 수 있음)
  const setAuth = (userData, tokenData) => {
    token.value = tokenData;
    user.value = userData;
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ 로그아웃 시
  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ✅ 앱 시작 or 새로고침 시 localStorage로부터 복원
  const restore = () => {
    token.value = localStorage.getItem("token") || null;
    const saved = localStorage.getItem("user");
    user.value = saved ? JSON.parse(saved) : null;
  };

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isProfessor,
    setAuth,
    clearAuth,
    restore,
  };
});
