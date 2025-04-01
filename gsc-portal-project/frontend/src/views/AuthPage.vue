<template>
    <div>
      <h1>🔑 로그인 처리 중...</h1>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "../store/authStore";
  import { useRouter } from "vue-router";
  import { onMounted } from "vue";
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
  
      onMounted(() => {
        console.log("✅ AuthPage.vue 마운트됨");
  
        // 🔹 URL에서 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
  
        console.log("✅ URL에서 추출한 토큰:", token); // ✅ 확인용 로그 추가
  
        if (token) {
          authStore.setToken(token); // ✅ JWT 저장
          console.log("✅ JWT 저장 완료");
          router.push("/home"); // ✅ 로그인 후 이동할 페이지
        } else {
          console.log("❌ 토큰이 없음, 로그인 페이지로 이동");
          router.push("/login");
        }
      });
  
      return { authStore };
    },
  };
  </script>
  