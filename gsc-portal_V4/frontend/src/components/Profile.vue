<template>
  <div class="profile-page">
    <h2>내 프로필</h2>
    <div class="profile-info">
      <p><b>이름:</b> {{ profile.name }}</p>
      <p><b>이메일:</b> {{ profile.email }}</p>
      <p><b>권한:</b> {{ roleName }}</p>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useAuthStore } from "../store/authStore.js";
import { useUserStore } from "../store/userStore.js";

export default {
  name: "Profile",
  setup() {
    const authStore = useAuthStore();
    const userStore = useUserStore();

    onMounted(async () => {
      if (authStore.token) {
        await userStore.loadProfile(authStore.token);
        authStore.setUser(userStore.profile);
      }
    });

    const profile = computed(() => userStore.profile);
    const roleName = computed(() => {
      switch (profile.value.role_id) {
        case 1: return "관리자";
        case 2: return "교수";
        default: return "학생";
      }
    });

    return {
      profile,
      roleName,
    };
  },
};
</script>

<style scoped>
.profile-page {
  margin: 20px;
}
.profile-info {
  border: 1px solid #ccc;
  padding: 20px;
}
</style>
