// [경로: frontend/src/store/authStore.js]
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const isAuthenticated = ref(!!localStorage.getItem("token"));

  const setAuth = (userData, tokenData) => {
    token.value = tokenData;
    user.value = userData;
    isAuthenticated.value = true;
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    clearAuth,
  };
});
