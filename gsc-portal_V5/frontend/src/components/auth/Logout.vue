<template>
  <div class="logout-container">
    <h2>로그아웃 중...</h2>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { logoutRequest } from "../../api/auth.js";
import { useRouter } from "vue-router";

export default {
  name: "Logout",
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await logoutRequest(authStore.token);
      }
      authStore.logout();
      router.push("/login");
    });
  },
};
</script>

<style scoped>
.logout-container {
  text-align: center;
  margin-top: 100px;
}
</style>
