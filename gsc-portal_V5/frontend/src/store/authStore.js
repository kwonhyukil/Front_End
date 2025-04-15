// 📁 [경로: frontend/src/store/authStore.js]
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  // 🔑 상태
  const token = ref(localStorage.getItem("token") || null); // AccessToken
  const user = ref(JSON.parse(localStorage.getItem("user") || null));
  const isAuthenticated = computed(() => !!token.value);

  const isAdmin = computed(() => user.value?.role_id === 1);
  const isProfessor = computed(() => user.value?.role_id === 2);
  const isStudent = computed(() => user.value?.role_id === 3);

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

  const isReady = ref(false);

  // ✅ 앱 시작 or 새로고침 시 localStorage로부터 복원
  const restore = () => {
    token.value = localStorage.getItem("token") || null;
    const saved = localStorage.getItem("user");
    user.value = saved ? JSON.parse(saved) : null;
    isReady.value = true;
  };
  const restoreAccessToken = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8080/api/token/refresh",
        null,
        {
          withCredentials: true,
        }
      );
      const newToken = res.data.accessToken;
      token.value = newToken;
      localStorage.setItem("token", newToken);
      return newToken;
    } catch (e) {
      console.warn("❌ accessToken 재발급 실패", e);
      clearAuth();
      return null;
    }
  };

  // 백엔드에서 사용자 정보 요청
  const fetchUserProfile = async () => {
    if (!token.value) return;
    try {
      const res = await axios.get("http://localhost:8080/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        withCredentials: true,
      });
      console.log("✅ 프로필 응답:", res.data); // 👈 이거 꼭 확인
      user.value = res.data;
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.warn("❌ 사용자 정보 가져오기 실패:", err);
      clearAuth();
    }
  };

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isProfessor,
    isStudent,
    setAuth,
    clearAuth,
    restore,
    restoreAccessToken,
    fetchUserProfile,
    isReady,
  };
});
