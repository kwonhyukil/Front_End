import { defineStore } from "pinia";
import axios from "axios";
import router from "../router"; // ✅ useRouter() 대신 직접 router 가져오기

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null, // ✅ JWT 초기 로드
  }),

  actions: {
    // ✅ 사용자 정보 불러오기 (JWT 기반)
    async fetchUser() {
      try {
        const token = localStorage.getItem("token");
        console.log("📥 저장된 JWT 토큰:", token);
        if (!token) {
          console.error("❌ JWT 토큰 없음");
          this.user = null;
          return;
        }

        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/auth/user",
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ JWT 포함
            },
          }
        );

        this.user = response.data.user;
        console.log("✅ 사용자 정보 불러오기 성공:", this.user);
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        this.user = null;
      }
    },

    // ✅ 로그인 후 JWT 저장 및 리디렉트
    async handleAuthCallback(token) {
      if (!token) {
        console.error("❌ 로그인 실패: JWT 토큰 없음");
        router.push("/login");
        return;
      }

      console.log("📥 받은 JWT 토큰:", token);
      localStorage.setItem("token", token); // ✅ JWT 저장
      console.log("✅ JWT 저장 완료");

      // ✅ 사용자 정보 즉시 반영
      await this.fetchUser();

      // ✅ 상태가 반영된 후 리다이렉트
      router.push("/");
    },

    async loginWithGoogle() {
      window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/google";
    },

    // ✅ 로그아웃 처리
    async logout() {
      this.user = null;
      localStorage.removeItem("token");
      router.push("/");
      window.location.href = "/";
    },
  },
});
