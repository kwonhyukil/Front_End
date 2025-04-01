<template>
  <div class="home-container">
    <h1 v-if="user">{{ user.name }}님 환영합니다! 🎉</h1>
    <h1 v-else>환영합니다! 로그인을 해주세요.</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const user = ref(null);

const checkLogin = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // ✅ 한글이 깨지지 않도록 디코딩
    const payload = JSON.parse(
      decodeURIComponent(escape(atob(token.split(".")[1])))
    );

    user.value = {
      name: payload.user.name, // 한글 깨짐 해결됨!
      picture: payload.user.picture, // 필요 시 추가
    };

    console.log("✅ 로그인된 사용자:", user.value);
  } catch (e) {
    console.error("토큰 파싱 실패", e);
    localStorage.removeItem("token");
  }
};

const logout = () => {
  localStorage.removeItem("token");
  user.value = null;
  window.location.href = "/auth";
};

onMounted(checkLogin);


</script>
  <style scoped>
  .home-container {
    text-align: center;
    margin-top: 50px;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  