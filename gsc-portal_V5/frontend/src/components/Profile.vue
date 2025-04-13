<!-- [경로: frontend/src/components/Profile.vue] -->
<template>
  <div class="profile-page">
    <h2>내 프로필</h2>
    <p>이름: {{ profile.name }}</p>
    <p>이메일: {{ profile.email }}</p>
    <p>역할: {{ profile.role_name }}</p>
    <p v-if="profile.student_id">학번: {{ profile.student_id }}</p>
    <p>유학생: {{ profile.is_international ? 'Yes' : 'No' }}</p>
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
        authStore.setAuth(userStore.profile, authStore.token);
      }
    });

    const profile = computed(() => userStore.profile);

    return { profile };
  },
};
</script>

<style scoped>
.profile-page {
  margin: 20px;
}
</style>
