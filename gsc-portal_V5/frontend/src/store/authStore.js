// 📁 [경로: frontend/src/store/authStore.js]
import { defineStore } from "pinia";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode

export const useAuthStore = defineStore("auth", () => {
  // 🔑 상태
  const token = ref(localStorage.getItem("token") || null); // AccessToken
  const user = ref(JSON.parse(localStorage.getItem("user") || null));
  const isAuthenticated = ref(!!token.value);

  // ✅ 로그인 시 (Google OAuth 콜백이 /home?accessToken=... 로 오면 처리)
  //    userData: { id, name, email, role } (백엔드에서 JWT에 담거나 별도 API로 받아올 수 있음)
  const setAuth = (userData, tokenData) => {
    token.value = tokenData;
    user.value = userData;
    isAuthenticated.value = true;

    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ 로그아웃 시
  const clearAuth = () => {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ✅ 앱 시작 or 새로고침 시 localStorage로부터 복원
  const restore = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      token.value = savedToken;
      user.value = JSON.parse(savedUser);
      isAuthenticated.value = true;
    } else {
      clearAuth();
    }
  };

  return {
    token,
    user,
    isAuthenticated,

    setAuth,
    clearAuth,
    restore,
  };
});
