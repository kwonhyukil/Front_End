<template>
    <div class="register-wrapper">
      <div class="register-container">
        <h2>회원가입</h2>
        <form @submit.prevent="register">
          
          <div class="input-group">
            <label for="name">이름</label>
            <input type="text" id="name" v-model="name" placeholder="이름을 입력하세요" required />
          </div>
  
          <div class="input-group">
            <label for="studentid">학번</label>
            <input type="text" id="studentid" v-model="studentid" placeholder="학번을 입력하세요" required />
          </div>
  
          <div class="input-group">
            <label for="phone">전화번호</label>
            <input type="tel" id="phone" v-model="phone" placeholder="010-1234-5678" required pattern="010-[0-9]{4}-[0-9]{4}" />
          </div>
  
          <div class="input-group">
            <label for="email">이메일</label>
            <input type="email" id="email" v-model="email" placeholder="이메일을 입력하세요" required />
          </div>
  
          <div class="input-group">
            <label for="year">학년</label>
            <select id="year" v-model="year" required>
              <option disabled value="">학년 선택</option>
              <option value="1학년">1학년</option>
              <option value="2학년">2학년</option>
              <option value="3학년">3학년</option>
            </select>
          </div>
  
          <div class="input-group">
            <label for="status">재학 상태</label>
            <select id="status" v-model="status" required>
              <option disabled value="">재학 상태 선택</option>
              <option value="재학">재학</option>
              <option value="휴학">휴학</option>
              <option value="유학생">유학생</option>
            </select>
          </div>
  
          <div class="input-group">
            <label for="role">권한</label>
            <select id="role" v-model="role" required>
              <option disabled value="">권한 선택</option>
              <option value="학생">학생</option>
              <option value="관리자">관리자</option>
              <option value="교수">교수</option>
              <option value="조교">조교</option>
            </select>
          </div>
  
          <button type="submit">가입하기</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import axios from "axios";
  
  const name = ref("");
  const studentid = ref(""); // ✅ studentId → student_id 변경
  const phone = ref("");
  const email = ref("");
  const year = ref("");
  const status = ref("");
  const role = ref("학생");
  
  const register = async () => {
    try {
      const register = async () => {
  try {
    console.log("✅ Vue에서 보낸 role 값:", role.value, "| type:", typeof role.value);

    const userData = {
      name: name.value,
      studentid: studentid.value,
      phone: phone.value,
      email: email.value,
      year: year.value,
      status: status.value,
      role: role.value.trim(),  // 🔹 공백 제거 추가
    };

    console.log("📤 회원가입 요청 데이터:", userData);

    await axios.post(import.meta.env.VITE_BACKEND_URL + "/auth/register", userData);

    alert("회원가입 신청이 완료되었습니다.");
  } catch (error) {
    console.error("회원가입 실패", error);
    alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
  }
};

      let userData = {
        name: name.value.trim(),
        studentid: studentid.value.trim(), // ✅ 공백 제거
        phone: phone.value.trim(),
        email: email.value.trim(),
        year: year.value.trim(),
        status: status.value.trim(),
        role: role.value.trim(), // ✅ role 값도 공백 제거
      };
      

      // ✅ ENUM 값 검증 (올바른 값만 전달)
      const validRoles = ["학생", "관리자", "교수", "조교"];
      if (!validRoles.includes(userData.role)) {
        alert("올바른 역할을 선택하세요.");
        return;
      }

      console.log("📤 회원가입 요청 데이터:", userData) // ✅ 데이터 확인

      await axios.post(import.meta.env.VITE_BACKEND_URL + "/auth/register", userData);

      alert("회원가입 신청이 완료되었습니다.");
    } catch (error) {
      console.error("회원가입 실패", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  </script>
  
  <style scoped>
  /* ✅ 전체 페이지 꽉 차게 사용 */
  .register-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f1f5f9;
  }
  
  /* ✅ 컨테이너 크기 확장 */
  .register-container {
    width: 100%;
    max-width: 1000;
    padding: 50px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  /* ✅ 입력 필드 전체 너비 사용 */
  .input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  
  label {
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 5px;
  }
  
  /* ✅ 입력 필드 스타일 */
  input,
  select {
    width: 100%;
    padding: 14px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    background: #f8f9fa;
    transition: border 0.3s;
  }
  
  input:focus,
  select:focus {
    border: 1px solid #007bff;
    outline: none;
  }
  
  /* ✅ 버튼 스타일 */
  button {
    width: 100%;
    padding: 14px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button:hover {
    background: #0056b3;
  }
  </style>
  