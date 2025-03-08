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
/* 전체 페이지 스타일 */
div {
  font-family: Arial, sans-serif;
  color: black;
}
</style>
