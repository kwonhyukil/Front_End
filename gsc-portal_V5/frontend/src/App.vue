<!-- 📁 [경로: frontend/src/App.vue] -->
<template>
  <NavBar />
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./store/authStore";
import NavBar from "./components/navbar/NavBar.vue";

const auth = useAuthStore();

onMounted(async () => {
  auth.restore();

  if (!auth.token) {
    await auth.restoreAccessToken();
  }

  if (auth.token && !auth.user) {
    await auth.fetchUserProfile();
  }
});
</script>

<style>
/* 필요 시 */
</style>
