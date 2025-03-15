// frontend/src/store/authStore.js
import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
  }),

  actions: {
    async fetchUser() {
      if (!this.token) return;
      try {
        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/auth/user",
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        this.user = res.data.user;
      } catch (error) {
        console.error("❌ fetchUser 오류:", error);
        this.user = null;
      }
    },

    async handleAuthCallback(accessToken, refreshToken) {
      if (!accessToken || !refreshToken) {
        router.push("/login");
        return;
      }
      this.token = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(await this.fetchUser())); // ✅ 사용자 정보 저장
      router.push("/home");
    },

    async loginWithGoogle() {
      window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/google";
    },

    async logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      localStorage.clear(); // ✅ 모든 저장된 정보 초기화
      router.push("/login");
    },

    async refreshAccessToken() {
      if (!this.refreshToken) return;
      try {
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/auth/refresh-token",
          {},
          { headers: { Authorization: `Bearer ${this.refreshToken}` } }
        );
        this.token = res.data.accessToken;
        this.refreshToken = res.data.refreshToken;
        localStorage.setItem("token", this.token);
        localStorage.setItem("refreshToken", this.refreshToken);
        await this.fetchUser();
      } catch (error) {
        console.error("❌ refreshAccessToken 오류:", error);
        this.logout();
      }
    },
    restoreUser() {
      this.user = JSON.parse(localStorage.getItem("user")) || null;
      this.token = localStorage.getItem("token") || null;
      this.refreshToken = localStorage.getItem("refreshToken") || null;
    },
  },
});
