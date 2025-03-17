<!-- 📄 TimetableForm.vue -->
<template>
  <div class="timetable-form">
    <h2>시간표 등록/수정</h2>

    <!-- 📌 과목명 입력 -->
    <div>
      <label>과목명: </label>
      <input v-model="courseName" placeholder="예) 알고리즘" />
    </div>

    <!-- 📌 교수 ID 입력 -->
    <div>
      <label>교수 ID: </label>
      <input type="number" v-model="professorId" placeholder="예) 123" />
    </div>

    <!-- 📌 요일 선택 -->
    <div>
      <label>요일: </label>
      <select v-model="dayOfWeek">
        <option value="월">월</option>
        <option value="화">화</option>
        <option value="수">수</option>
        <option value="목">목</option>
        <option value="금">금</option>
        <option value="토">토</option>
      </select>
    </div>

    <!-- 📌 시작 시간 선택 -->
    <div>
      <label>시작 시간: </label>
      <input type="time" v-model="startTime" />
    </div>

    <!-- 📌 종료 시간 선택 -->
    <div>
      <label>종료 시간: </label>
      <input type="time" v-model="endTime" />
    </div>

    <!-- 📌 강의실 입력 -->
    <div>
      <label>강의실: </label>
      <input v-model="room" placeholder="예) A101" />
    </div>

    <!-- 📌 특정 날짜 입력 (선택 사항) -->
    <div>
      <label>특정 날짜(custom_date): </label>
      <input type="date" v-model="customDate" />
    </div>

    <!-- 📌 색상 선택 (시간표 UI에서 사용) -->
    <div>
      <label>색상(color_code): </label>
      <input type="color" v-model="colorCode" />
    </div>

    <!-- 📌 "등록" 버튼 -->
    <button @click="submitTimetable">등록</button>
  </div>
</template>

<script>
import { ref } from "vue";
import { createTimetableRequest } from "../../api/timetable.js"; // 시간표 API 호출
import { useAuthStore } from "../../store/authStore.js"; // 사용자 인증 정보
import { useRouter } from "vue-router";

export default {
  name: "TimetableForm",
  setup() {
      const router = useRouter();
      const authStore = useAuthStore();

      // 📌 입력값을 저장하는 반응형 변수
      const courseName = ref(""); // 과목명
      const professorId = ref(""); // 교수 ID
      const dayOfWeek = ref("월"); // 기본값: 월요일
      const startTime = ref("09:00"); // 기본값: 9시 시작
      const endTime = ref("10:00"); // 기본값: 10시 종료
      const room = ref(""); // 강의실 정보
      const customDate = ref(""); // 특정 날짜 (선택)
      const colorCode = ref(""); // 색상 (선택)

      /**
       * 📌 시간표 등록 함수
       * - 사용자가 입력한 데이터를 서버로 전송
       */
      const submitTimetable = async () => {
          try {
              await createTimetableRequest(authStore.token, {
                  course_name: courseName.value,
                  professor_id: professorId.value,
                  day_of_week: dayOfWeek.value,
                  start_time: startTime.value,
                  end_time: endTime.value,
                  room: room.value,
                  custom_date: customDate.value || null, // 선택 사항
                  color_code: colorCode.value || null, // 선택 사항
              });

              alert("시간표가 등록되었습니다.");
              router.push("/timetables"); // 등록 후 시간표 목록 페이지로 이동
          } catch (error) {
              alert("시간표 등록 실패: " + (error.response?.data?.error || error.message));
          }
      };

      return {
          courseName, professorId, dayOfWeek, startTime, endTime, room,
          customDate, colorCode, submitTimetable,
      };
  },
};
</script>

<style scoped>
.timetable-form {
  margin: 20px;
  max-width: 400px;
}
.timetable-form div {
  margin-bottom: 10px;
}
.timetable-form input,
.timetable-form select {
  width: 100%;
  padding: 6px;
  margin-top: 4px;
}
.timetable-form button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
