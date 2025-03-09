<!-- frontend/src/App.vue -->
<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<style scoped>
/* 전체적인 레이아웃, NavBar 아래 컨텐츠가 보이도록 패딩 */
</style>
