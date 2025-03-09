import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  }),

  actions: {
    // ✅ 사용자 정보 가져오기
    async fetchUser() {
      console.log("🔄 fetchUser 실행");

      let token = this.token || localStorage.getItem("token");
      if (!token) {
        console.warn("❌ JWT 토큰 없음, 새 토큰 요청 시도...");
        await this.refreshAccessToken();
        token = this.token || localStorage.getItem("token");
        if (!token) {
          console.error("❌ 새 JWT 토큰 요청 실패");
          this.user = null;
          return;
        }
      }

      try {
        console.log("📥 JWT로 사용자 정보 요청:", token);
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/auth/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        this.user = response.data.user;
        console.log("✅ 사용자 정보 불러오기 성공:", this.user);
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        this.user = null;
        if (error.response?.status === 401) {
          console.warn("🔄 토큰 만료됨, 새 토큰 요청 시도...");
          await this.refreshAccessToken();
        }
      }
    },

    // ✅ Google OAuth 로그인 후 JWT 저장
    async handleAuthCallback(accessToken, refreshToken) {
      if (!accessToken || !refreshToken) {
        console.error("❌ 로그인 실패: JWT 또는 Refresh 토큰 없음");
        router.push("/login");
        return;
      }

      console.log("📥 받은 JWT 토큰:", accessToken);
      console.log("📥 받은 Refresh 토큰:", refreshToken);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      this.token = accessToken;
      this.refreshToken = refreshToken;

      console.log("✅ JWT 저장 완료, 사용자 정보 불러오기");
      await this.fetchUser();
    },

    // ✅ Google 로그인 요청
    async loginWithGoogle() {
      window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/google";
    },

    // ✅ 로그아웃
    async logout() {
      console.log("🚪 로그아웃 진행 중...");
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/login"); // 홈 대신 로그인으로 이동
    },

    // ✅ JWT 갱신
    async refreshAccessToken() {
      try {
        console.log("🔄 JWT 갱신 시도...");
        const rToken =
          this.refreshToken || localStorage.getItem("refreshToken");
        if (!rToken) {
          console.error("❌ Refresh Token 없음, 로그아웃 처리");
          this.logout();
          return;
        }

        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/auth/refresh-token",
          {},
          { headers: { Authorization: `Bearer ${rToken}` } }
        );
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        console.log("✅ 새 JWT 발급:", accessToken);
        console.log("✅ 새 Refresh Token 발급:", newRefreshToken);

        this.token = accessToken;
        this.refreshToken = newRefreshToken;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // ✅ 갱신 후 사용자 정보 다시 불러오기
        await this.fetchUser();
      } catch (error) {
        console.error("❌ JWT 갱신 실패:", error);
        this.logout();
      }
    },
  },
});
