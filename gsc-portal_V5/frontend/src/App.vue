<!-- [frontend/src/App.vue] -->
<template>
  <!-- 전역 네비게이션 -->
  <NavBar />
  <!-- 라우터 뷰 -->
  <router-view />
</template>

<script>
import NavBar from "./components/navbar/Navbar.vue";

export default {
  name: "App",
  components: { NavBar },
};
</script>

<style>
/* 별도 스타일은 main.css */
</style>
