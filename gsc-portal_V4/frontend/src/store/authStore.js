import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || "");
  const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));

  // 로그인 여부
  const isAuthenticated = computed(() => !!token.value);
  // 역할
  const isAdmin = computed(() => user.value?.role_id === 1);
  const isProfessor = computed(() => user.value?.role_id === 2);

  // 토큰/유저 설정
  const setToken = (t) => {
    token.value = t;
    localStorage.setItem("token", t);
  };
  const setUser = (u) => {
    user.value = u;
    localStorage.setItem("user", JSON.stringify(u));
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
