<script setup>
import { RouterView, RouterLink } from "vue-router";
</script>

<template>
    <nav class="navbar">
      <div class="nav-menu">
        <router-link to="/">홈</router-link>
        <router-link to="/checkbox">체크박스</router-link>
        <router-link to="/num">설정</router-link>
      </div>
    </nav>
    <router-view />
</template>

<style scoped>
/* 네비게이션 바 스타일 */
.navbar {
  display: flex;
  justify-content: center;
  background: #222;
  padding: 10px 0;
}

/* 네비게이션 메뉴 스타일 */
.nav-menu {
  display: flex;
  gap: 20px;
}

/* 링크 스타일 */
.nav-menu a {
  color: white;
  text-decoration: none;
  padding: 10px;
  font-weight: bold;
}

/* 활성화된 링크 스타일 */
.nav-menu a.router-link-active {
  color: yellow;
  border-bottom: 2px solid yellow;
}
</style>
