<template>
  <div class="login-container">
    <h2>Google 로그인</h2>
    <button @click="loginWithGoogle">Google로 로그인</button>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../../store/authStore.js";
import { useUserStore } from "../../store/userStore.js";

export default {
  name: "Login",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const token = ref(route.query.token || "");
    const authStore = useAuthStore();
    const userStore = useUserStore();

    onMounted(async () => {
      if (token.value) {
        // 토큰 저장 + 사용자 프로필 로드
        authStore.setToken(token.value);
        await userStore.loadProfile(token.value);
        authStore.setUser(userStore.profile);
        router.push("/home");
      }
    });

    const loginWithGoogle = () => {
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      window.location.href = `${backendURL}/auth/google`;
    };

    return { token, loginWithGoogle };
  },
};
</script>

<style scoped>
.login-container {
  text-align: center;
  margin-top: 120px;
}
</style>
