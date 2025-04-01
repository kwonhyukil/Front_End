<template>
    <div>
      <h1>Google 로그인</h1>
      <GoogleLogin @success="handleSuccess" @error="handleError" />
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '../stores/useUserStore'
  import { useRouter } from 'vue-router'
  import axios from 'axios'
  
  const router = useRouter()
  const userStore = useUserStore()
  
  const handleSuccess = async (response) => {
    console.log("🟢 Google 로그인 성공");
  
    const token = response.credential;
    if (!token) {
      console.warn("⛔ 토큰 없음! Google에서 응답 실패함");
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', { token })
      console.log("✅ 서버 응답:", res.data)
      userStore.setUser(res.data)
      router.push('/dashboard')
    } catch (err) {
      console.error("❌ 서버 응답 실패", err)
    }
  }
  
  const handleError = () => {
    console.error("❌ Google 로그인 에러 발생");
  }
  </script>
  