<template>
    <nav>
      <router-link to="/home">🏠 홈</router-link>
      <router-link to="/timetable">📅 시간표</router-link>
      <router-link to="/notices">📢 공지사항</router-link>
      <router-link to="/login" v-if="!authStore.user">🔑 로그인</router-link>
      <button v-if="authStore.user" @click="logoutUser">🚪 로그아웃</button>
      <span v-if="authStore.user">👤 {{ authStore.user.name }}</span>
    </nav>
</template>
  
<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { onMounted } from 'vue';

export default {
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        const logoutUser = () => {
            authStore.logout();
            router.push("/login"); // ✅ 로그아웃 후 로그인 페이지로 이동
        };

        onMounted(() => {
            authStore.checkUser();
        });
        return { authStore, logoutUser };
    }
};

</script>


  <style>
  nav {
    display: flex;
    gap: 15px;
    padding: 10px;
    background: #f4f4f4;
  }
  router-link {
    text-decoration: none;
    color: black;
    font-weight: bold;
  }
  </style>
  