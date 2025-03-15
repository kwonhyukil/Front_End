<template>
  <div class="loading-screen">
    <h2>로그인 중...</h2>
  </div>
</template>

<script setup>
import { useAuthStore } from "../store/authStore";
import { useRoute, useRouter } from "vue-router";
import { onMounted } from "vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  const accessToken = route.query.accessToken;
  const refreshToken = route.query.refreshToken;
  const user = JSON.parse(route.query.user || "{}");

  if (accessToken && refreshToken) {
    authStore.setAuthData(accessToken, refreshToken, user);
    router.push("/home"); // ✅ 로그인 후 메인 페이지로 이동
  } else {
    router.push("/login?error=OAuth 실패");
  }
});
</script>

<style scoped>
.loading-screen {
  text-align: center;
  margin-top: 50px;
}
</style>
