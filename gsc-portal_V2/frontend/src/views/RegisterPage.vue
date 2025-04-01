<!-- frontend/src/views/RegisterPage.vue -->
<template>
  <div class="register-wrapper">
    <h2>회원가입</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" placeholder="이름" required />
      <input v-model="studentid" placeholder="학번" required />
      <input v-model="phone" placeholder="전화번호" required />
      <input v-model="email" placeholder="이메일(@g.yju.ac.kr)" required />
      <select v-model="year">
        <option value="1학년">1학년</option>
        <option value="2학년">2학년</option>
        <option value="3학년">3학년</option>
      </select>
      <select v-model="status">
        <option value="재학">재학</option>
        <option value="휴학">휴학</option>
        <option value="유학생">유학생</option>
      </select>
      <select v-model="role">
        <option value="학생">학생</option>
        <option value="관리자">관리자</option>
        <option value="교수">교수</option>
        <option value="조교">조교</option>
      </select>
      <button type="submit">회원가입</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const name = ref("");
const studentid = ref("");
const phone = ref("");
const email = ref("");
const year = ref("1학년");
const status = ref("재학");
const role = ref("학생");

const handleRegister = async () => {
  try {
    const userData = {
      name: name.value,
      email: email.value,
      studentid: studentid.value,
      phone: phone.value,
      year: year.value,
      status: status.value,
      role: role.value,
    };
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/auth/register", userData);
    alert(response.data.message);

    // 관리자 메일이면 즉시 승인 => token, refreshToken
    if (response.data.token && response.data.refreshToken) {
      alert("관리자 계정 승인 완료! 다시 로그인해주세요.");
    }
  } catch (error) {
    console.error("회원가입 오류:", error);
    alert(error.response?.data?.error || "회원가입 실패");
  }
};
</script>

<style scoped>
.register-wrapper {
  margin: 80px auto;
  max-width: 400px;
  text-align: center;
}
</style>
