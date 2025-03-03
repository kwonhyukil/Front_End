<template>
    <div class="login-container">
        <h2>로그인</h2>
        <button @click="loginWithGoogle">Google 로그인</button>
    </div>
</template>

<script setup>
import { useAuthStore } from '../store/authStore';

const authStore = useAuthStore();
const loginWithGoogle = () => {
    authStore.loginWithGoogle();
}

</script>