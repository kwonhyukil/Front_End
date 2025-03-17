<template>
    <div class="registration-form">
      <h2>회원정보 입력</h2>
      <!-- email은 Google 로그인에서 넘겨받은 값 -->
      <div>
        <label>이메일</label>
        <input v-model="email" type="text" readonly />
      </div>
      <div>
        <label>이름</label>
        <input v-model="name" type="text" />
      </div>
      <div>
        <label>휴대전화</label>
        <input v-model="phone" type="text" />
      </div>
      <div>
        <label>학번</label>
        <input v-model="student_id" type="text" />
      </div>
      <div>
        <label>권한</label>
        <select v-model="role_id">
          <option value="3">학생</option>
          <option value="2">교수</option>
          <option value="1">관리자</option>
        </select>
      </div>
      <div>
        <label>유학생 여부</label>
        <input type="checkbox" v-model="is_international" />
      </div>
      <button @click="saveRegistrationData">등록</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { saveRegistrationRequest } from "../../api/user.js";
  
  export default {
    name: "RegistrationForm",
    setup() {
      const route = useRoute();
      const router = useRouter();
  
      const email = ref(route.query.email || "");
      const name = ref("");
      const phone = ref("");
      const student_id = ref("");
      const role_id = ref("3"); // 학생 기본
      const is_international = ref(false);
  
      onMounted(() => {
        // Google 로그인 후 이메일 자동 세팅
        // 필요 시 name도 Google profile.displayName으로 세팅 가능
      });
  
      const saveRegistrationData = async () => {
        try {
          const payload = {
            email: email.value,
            name: name.value,
            phone: phone.value,
            student_id: student_id.value,
            role_id: Number(role_id.value),
            is_international: is_international.value,
          };
          await saveRegistrationRequest(payload);
          alert("회원정보가 임시 저장되었습니다. 관리자 승인 대기중입니다.");
          router.push("/login");
        } catch (error) {
          alert("등록 오류: " + error.response?.data?.error);
        }
      };
  
      return {
        email, name, phone, student_id, role_id, is_international,
        saveRegistrationData,
      };
    },
  };
  </script>
  
  <style scoped>
  .registration-form {
    margin: 20px auto;
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .registration-form label {
    display: inline-block;
    width: 100px;
  }
  </style>
  