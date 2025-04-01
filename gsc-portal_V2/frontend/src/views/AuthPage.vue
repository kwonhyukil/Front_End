<template>
    <div class="auth-container">
      <h1>🔑 Google 로그인 중...</h1>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  
  onMounted(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
  
    if (token) {
      // ✅ 토큰 저장 후 홈으로 이동
      localStorage.setItem("token", token);
      window.location.href = "/";
    } else {
      console.error("❌ 토큰이 없습니다. 로그인 실패!");
      window.location.href = "/login"; // 로그인 실패 시 로그인 페이지로 이동
    }
  });
  </script>
  
  <style scoped>
  .auth-container {
    text-align: center;
    margin-top: 50px;
  }
  </style>
  