<!-- frontend/src/views/HomePage.vue -->
<template>
  <div class="home-container">
    <h1 v-if="user">{{ user.name }}님 환영합니다!</h1>
    <h1 v-else>환영합니다! 로그인 해주세요.</h1>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

onMounted(async () => {
  await authStore.fetchUser();
});
</script>

<style scoped>
.home-container {
  margin-top: 80px;
  text-align: center;
}
</style>
