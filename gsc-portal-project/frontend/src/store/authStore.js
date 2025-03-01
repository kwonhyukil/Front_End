import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  actions: {
    // 🔹 로그인 (백엔드에서 토큰 받아 저장)
    async fetchUser() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/user`,
          { withCredentials: true }
        );
        this.user = response.data;
        // console.log(" 로그인된 사용자: ", this.user);
      } catch (error) {
        console.error("❌ 로그인 상태 확인 실패:", error);
        this.user = null;
      }
    },

    // 🔹 로그아웃 (쿠키 삭제)
    async logout() {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
          null,
          { withCredentials: true }
        );
        this.user = null;
        console.log("로그아웃 성공");
      } catch (error) {
        console.log("로그아웃 실패: ", error.response?.data || error.message);
      }
    },

    // 앱이 실행될 때 사용자 로그인 상태 체크
    async checkUser() {
      await this.fetchUser();
    },
  },
});
