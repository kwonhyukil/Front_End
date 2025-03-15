<!-- Google 로그인 버튼 UI -->
<template>
    <div>
      <h1>학과 포털 로그인</h1>
      <button @click="googleLogin">Google 로그인</button>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      googleLogin() {
        window.location.href = "http://localhost:5000/auth/google";
      }
    }
  };
  </script>
  