// [경로: frontend/src/store/authStore.js]
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role_id === 1);
  const isProfessor = computed(() => user.value?.role_id === 2);

  const setToken = (newToken) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };
  const setUser = (userData) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    token.value = "";
    user.value = {};
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isProfessor,
    setToken,
    setUser,
    logout,
  };
});
