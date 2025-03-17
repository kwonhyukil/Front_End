<template>
    <div class="registration-container">
      <h2 class="title">회원 정보</h2>
      <form @submit.prevent="submitRegistration">
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" id="name" v-model="name" required />
        </div>
  
        <div class="form-group">
          <label for="studentId">학번</label>
          <input type="text" id="studentId" v-model="studentId" required />
        </div>
  
        <div class="form-group">
          <label for="phone">전화번호</label>
          <input type="tel" id="phone" v-model="phone" required />
        </div>
  
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" required />
        </div>
  
        <div class="form-group checkbox-group">
          <input type="checkbox" id="isInternational" v-model="isInternational" />
          <label for="isInternational">유학생 여부</label>
        </div>
  
        <button type="submit" class="submit-btn">가입 신청</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const name = ref("");
      const studentId = ref("");
      const phone = ref("");
      const email = ref("");
      const isInternational = ref(false);
      const router = useRouter();
  
      const submitRegistration = async () => {
        try {
          await axios.post("http://localhost:5000/api/auth/profile-setup", {
            name: name.value,
            studentId: studentId.value,
            phone: phone.value,
            email: email.value,
            isInternational: isInternational.value
          });
  
          alert("가입 신청이 완료되었습니다. 관리자 승인을 기다려 주세요.");
          router.push("/login");
        } catch (error) {
          console.error("가입 신청 실패:", error);
        }
      };
  
      return { name, studentId, phone, email, isInternational, submitRegistration };
    }
  };
  </script>
  
  <style scoped>
  .registration-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    background: #ffffff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
  }
  
  .title {
    font-size: 22px;
    margin-bottom: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .checkbox-group {
    display: flex;
    align-items: center;
  }
  
  .checkbox-group label {
    margin-left: 8px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .submit-btn:hover {
    background: #0056b3;
  }
  </style>
  