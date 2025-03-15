<!-- [경로: frontend/src/App.vue] -->
<template>
  <NavBar />
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
/* 전역 스타일 일부는 styles.css로 분리 */
body, html {
  margin: 0;
  padding: 0;
  font-family: "Noto Sans KR", sans-serif;
}
</style>