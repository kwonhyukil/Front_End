<template>
  <div class="logout-container">
    <p>로그아웃 처리 중...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/authStore';
import { logout } from '../../api/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  try {
    // 먼저 로컬 상태를 초기화
    authStore.clearAuth();
    
    // 백엔드에 로그아웃 요청
    await logout();
    
    // 로그인 페이지로 강제 리디렉션
    window.location.href = '/login';
  } catch (error) {
    console.error('로그아웃 실패:', error);
    // 에러가 발생해도 로그인 페이지로 강제 리디렉션
    window.location.href = '/login';
  }
};

// 컴포넌트가 마운트되면 즉시 로그아웃 처리
onMounted(() => {
  handleLogout();
});
</script>

<style scoped>
.logout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2em;
  color: #666;
}
</style>
