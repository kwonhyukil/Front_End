import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null, // ✅ JWT 초기 로드
    refreshToken: localStorage.getItem("refreshToken") || null, // ✅ Refresh Token 저장
  }),

  actions: {
    /**
     * ✅ 사용자 정보 가져오기 (JWT 기반 인증)
     * - 저장된 JWT 토큰을 이용해 사용자 정보를 가져온다.
     * - 토큰이 없거나 만료되었을 경우 자동으로 refreshAccessToken()을 호출하여 토큰을 갱신한다.
     */
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
        console.log("📥 저장된 JWT 토큰으로 사용자 정보 요청:", token);

        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/auth/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        this.user = response.data.user;
        console.log("✅ 사용자 정보 불러오기 성공:", this.user);
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        this.user = null;

        if (error.response?.status === 401) {
          console.warn("🔄 JWT 토큰 만료됨, 새 토큰 요청 시도...");
          await this.refreshAccessToken(); // 🔹 토큰 갱신 시도
        }
      }
    },

    /**
     * ✅ Google OAuth 로그인 후 JWT 저장 및 리다이렉트 처리
     * - 백엔드에서 반환된 JWT 및 Refresh Token을 저장
     * - 사용자 정보를 불러온 후, `/home`으로 이동
     */
    async handleAuthCallback() {
      console.log("🔄 Google OAuth Callback 처리 중...");

      // ✅ URL에서 accessToken 및 refreshToken 가져오기
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get("accessToken");
      const refreshToken = urlParams.get("refreshToken");

      console.log("📥 받은 JWT 토큰:", accessToken);
      console.log("📥 받은 Refresh 토큰:", refreshToken);

      if (!accessToken || !refreshToken) {
        console.error("❌ 로그인 실패: JWT 또는 Refresh 토큰 없음");
        router.push("/login");
        return;
      }

      // ✅ Local Storage에 JWT 및 Refresh Token 저장
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      this.token = accessToken;
      this.refreshToken = refreshToken;

      // ✅ 저장된 토큰 확인
      console.log("🔍 저장된 JWT 토큰:", localStorage.getItem("token"));
      console.log(
        "🔍 저장된 Refresh 토큰:",
        localStorage.getItem("refreshToken")
      );

      // ✅ 사용자 정보 요청 후 대시보드로 이동
      await this.fetchUser();

      if (this.user) {
        console.log("✅ 로그인 성공, 대시보드로 이동");
        await this.fetchUser();
        router.push("/home"); // 🔹 대시보드로 이동
      } else {
        console.error("❌ 로그인 후 사용자 정보를 가져오지 못함.");
        router.push("/login");
      }
    },

    /**
     * ✅ Google 로그인 요청
     * - 백엔드에서 Google OAuth 로그인 페이지로 리디렉트
     */
    async loginWithGoogle() {
      window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/google";
    },
    /**
     * ✅ 로그아웃 처리
     * - 사용자 상태 초기화 및 로컬 스토리지에서 JWT 삭제
     * - 홈페이지로 이동
     */
    async logout() {
      console.log("🚪 로그아웃 진행 중...");
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      console.log("✅ JWT 및 사용자 정보 삭제 완료");
      router.push("/home"); // 🔹 로그아웃 후 홈으로 이동
    },

    /**
     * ✅ JWT 갱신 (Refresh Token 이용)
     * - Refresh Token을 이용해 새로운 Access Token을 요청한다.
     * - 실패 시 자동 로그아웃 처리
     */
    async refreshAccessToken() {
      try {
        console.log("🔄 JWT 갱신 시도...");
        const refreshToken =
          this.refreshToken || localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.error("❌ Refresh Token 없음, 로그아웃 처리");
          this.logout();
          return;
        }

        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/auth/refresh-token",
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        console.log("✅ 새 JWT 발급:", accessToken);
        console.log("✅ 새 Refresh Token 발급:", newRefreshToken);

        this.token = accessToken;
        this.refreshToken = newRefreshToken;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // ✅ 토큰 갱신 후 사용자 정보 다시 가져오기
        await this.fetchUser();
      } catch (error) {
        console.error("❌ JWT 갱신 실패:", error);
        this.logout(); // 🔹 실패 시 로그아웃 처리
      }
    },
  },
});
