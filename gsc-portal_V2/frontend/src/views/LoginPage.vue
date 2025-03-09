<template>
    <div class="login-container">
      <h2>로그인 페이지</h2>
      <button @click="loginWithGoogle">Google 로그인</button>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from "../store/authStore";
  
  const authStore = useAuthStore();
  
  const loginWithGoogle = () => {
    authStore.loginWithGoogle();
  };
  </script>
  
  <style scoped>
  .login-container {
    margin-top: 50px;
    text-align: center;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
  }
  </style>
  