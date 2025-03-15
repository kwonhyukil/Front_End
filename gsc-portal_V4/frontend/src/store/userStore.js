// [경로: frontend/src/store/userStore.js]
import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchUserProfile } from "../api/user.js";

export const useUserStore = defineStore("user", () => {
  const profile = ref({});

  const loadProfile = async (token) => {
    try {
      const data = await fetchUserProfile(token);
      profile.value = data;
    } catch (error) {
      console.error("loadProfile error:", error);
    }
  };

  return { profile, loadProfile };
});
