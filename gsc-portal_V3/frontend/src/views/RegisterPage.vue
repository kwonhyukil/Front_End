<template>
    <div class="register-container">
      <h2>회원가입</h2>
      <form @submit.prevent="register">
        <input v-model="email" type="email" placeholder="이메일" required />
        <input v-model="studentid" type="text" placeholder="학번" required />
        <input v-model="phone" type="text" placeholder="전화번호" required />
        <input v-model="name" type="text" placeholder="이름" required />
        <button type="submit">회원가입 신청</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const email = ref("");
  const studentid = ref("");
  const phone = ref("");
  const name = ref("");
  const message = ref("");
  
  const register = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        email: email.value,
        studentid: studentid.value,
        phone: phone.value,
        name: name.value,
        year: "1학년",
        status: "재학생",
        role: "학생",
        picture: "",
      });
  
      message.value = response.data.message;
    } catch (error) {
      message.value = error.response?.data?.message || "회원가입 요청 중 오류 발생";
    }
  };
  </script>
  