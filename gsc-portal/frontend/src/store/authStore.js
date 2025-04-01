import { defineStore } from "pinia";
import axios from "axios";
import router from "../router"; // ✅ useRouter() 대신 직접 router 가져오기

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null, // 🔹 현재 로그인된 사용자 정보
    token: localStorage.getItem("token") || null, // 🔹 JWT Access Token (초기 로드 시 localStorage에서 가져옴)
    refreshToken: localStorage.getItem("refreshToken") || null, // 🔹 Refresh Token (초기 로드 시 localStorage에서 가져옴)
  }),

  actions: {
    /**
     * ✅ 사용자 정보 불러오기 (JWT 기반 인증)
     * - localStorage에 저장된 JWT를 이용하여 사용자 정보를 가져옴
     * - JWT가 만료되면 `refreshAccessToken()`을 호출하여 자동 갱신 시도
     */
    async fetchUser() {
      try {
        const token = this.token || localStorage.getItem("token");
        console.log("📥 저장된 JWT 토큰:", token);

        // 🔹 토큰이 없으면 사용자 정보를 가져올 수 없음
        if (!token) {
          console.error("❌ JWT 토큰 없음");
          this.user = null;
          return;
        }

        // 🔹 백엔드에서 사용자 정보 가져오기
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/auth/user",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ JWT 포함하여 요청
            },
          }
        );

        this.user = response.data.user;
        console.log("✅ 사용자 정보 불러오기 성공:", this.user);
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        this.user = null;

        // 🔹 JWT가 만료되었을 경우 자동 갱신 시도
        if (error.response?.status === 401) {
          await this.refreshAccessToken();
        }
      }
    },

    /**
     * ✅ 로그인 후 JWT & Refresh Token 저장 및 리디렉트
     * - 로그인 후 받은 JWT & Refresh Token을 저장
     * - 이후 자동으로 `fetchUser()`를 호출하여 사용자 정보를 가져옴
     */
    async handleAuthCallback(accessToken, refreshToken) {
      if (!accessToken || !refreshToken) {
        console.error("❌ 로그인 실패: JWT 또는 Refresh 토큰 없음");
        router.push("/login");
        return;
      }

      console.log("📥 받은 JWT 토큰:", accessToken);
      console.log("📥 받은 Refresh 토큰:", refreshToken);

      // 🔹 localStorage에 토큰 저장
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      this.token = accessToken;
      this.refreshToken = refreshToken;

      console.log("✅ JWT 저장 완료");

      // 🔹 사용자 정보 가져오기
      await this.fetchUser();

      // 🔹 로그인 성공 후 메인 페이지로 이동
      router.push("/");
    },

    /**
     * ✅ Google 로그인 요청
     * - 백엔드 `/auth/google` 엔드포인트를 호출하여 OAuth 로그인 시작
     */
    async loginWithGoogle() {
      window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/google";
    },

    /**
     * ✅ 로그아웃 처리 (로컬 저장소 삭제)
     * - 사용자 정보 및 JWT를 초기화
     * - localStorage에서 JWT & Refresh Token 삭제
     * - 메인 페이지(`/`)로 이동
     */
    async logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;

      // 🔹 localStorage에서 토큰 제거
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // 🔹 로그아웃 후 홈페이지로 이동
      router.push("/");
      window.location.href = "/";
    },

    /**
     * ✅ JWT 갱신 (Refresh Token 이용)
     * - 기존 JWT가 만료되었을 때 자동으로 새로운 JWT를 발급받음
     * - Refresh Token이 없으면 로그아웃 처리
     */
    async refreshAccessToken() {
      try {
        console.log("🔄 JWT 갱신 시도...");
        const refreshToken =
          this.refreshToken || localStorage.getItem("refreshToken");

        // 🔹 Refresh Token이 없으면 로그아웃 처리
        if (!refreshToken) {
          console.error("❌ Refresh Token 없음, 로그아웃 처리");
          this.logout();
          return;
        }

        // 🔹 백엔드 `/auth/refresh-token` 엔드포인트 호출
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/auth/refresh-token",
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        // 🔹 새롭게 발급된 Access Token 및 Refresh Token 저장
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        console.log("✅ 새 JWT 발급:", accessToken);
        console.log("✅ 새 Refresh Token 발급:", newRefreshToken);

        this.token = accessToken;
        this.refreshToken = newRefreshToken;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
      } catch (error) {
        console.error("❌ JWT 갱신 실패:", error);
        this.logout();
      }
    },
  },
});
