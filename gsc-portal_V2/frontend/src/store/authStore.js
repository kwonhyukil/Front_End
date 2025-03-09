// frontend/src/store/authStore.js
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
      await this.fetchUser();
      router.push("/home");
    },

    async loginWithGoogle() {
      window.location.href = import.meta.env.VITE_BACKEND_URL + "/auth/google";
    },

    async logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
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
  },
});
