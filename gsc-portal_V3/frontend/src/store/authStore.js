import { defineStore } from "pinia";
import { ref, computed, onMounted } from "vue";
import { googleLogin, login, logout, refreshAccessToken } from "../api/auth";

export const useAuthStore = defineStore("auth", () => {
  // ✅ 상태 변수
  const token = ref(localStorage.getItem("accessToken") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);
  const user = ref(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // ✅ 로그인 여부 확인
  const isAuthenticated = computed(() => token.value !== null);
  const isAdmin = computed(
    () => user.value?.role === "관리자" || user.value?.role === "교수"
  );

  // ✅ 토큰 및 유저 정보 저장
  const setAuthData = (accessToken, newRefreshToken, userData) => {
    token.value = accessToken;
    refreshToken.value = newRefreshToken;
    user.value = userData;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Google OAuth 로그인 요청
  const loginWithGoogle = () => {
    googleLogin();
  };

  // ✅ 로그인 요청 (이메일 기반)
  const loginUser = async (email) => {
    try {
      const data = await login(email);
      if (data.accessToken) {
        setAuthData(data.accessToken, data.refreshToken, data.user);
      }
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
    }
  };

  // ✅ Access Token 자동 갱신 (새로고침 시 실행)
  const checkAndRefreshToken = async () => {
    if (!token.value && refreshToken.value) {
      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          token.value = newAccessToken;
          localStorage.setItem("accessToken", newAccessToken);
        } else {
          logoutUser();
        }
      } catch (error) {
        console.error("❌ 토큰 갱신 실패:", error);
        logoutUser();
      }
    }
  };

  // ✅ 로그아웃 (토큰 삭제 및 상태 초기화)
  const logoutUser = () => {
    logout();
    token.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    window.location.href = "/login"; // ✅ 로그아웃 후 로그인 페이지로 이동
  };

  // ✅ 앱이 로드될 때 자동 로그인 확인
  onMounted(() => {
    checkAndRefreshToken();
  });

  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    isAdmin,
    setAuthData,
    checkAndRefreshToken,
    loginWithGoogle,
    loginUser,
    logoutUser,
  };
});
