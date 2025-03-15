<!-- [경로: frontend/src/components/timetable/TimetableForm.vue] -->
<template>
    <div class="timetable-form">
      <h2>시간표 등록/수정</h2>
      <div>
        <label>과목명: </label>
        <input v-model="courseName" />
      </div>
      <div>
        <label>교수 ID: </label>
        <input type="number" v-model="professorId" />
      </div>
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
      <div>
        <label>시작 시간: </label>
        <input type="time" v-model="startTime" />
      </div>
      <div>
        <label>종료 시간: </label>
        <input type="time" v-model="endTime" />
      </div>
      <div>
        <label>강의실: </label>
        <input v-model="room" />
      </div>
      <div>
        <label>특정 날짜(custom_date): </label>
        <input type="date" v-model="customDate" />
      </div>
      <div>
        <label>색상(color_code): </label>
        <input type="color" v-model="colorCode" />
      </div>
  
      <button @click="submitTimetable">등록</button>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { createTimetableRequest } from "../../api/timetable.js";
  import { useAuthStore } from "../../store/authStore.js";
  import { useRouter } from "vue-router";
  
  export default {
    name: "TimetableForm",
    setup() {
      const router = useRouter();
      const authStore = useAuthStore();
  
      const courseName = ref("");
      const professorId = ref("");
      const dayOfWeek = ref("월");
      const startTime = ref("09:00");
      const endTime = ref("10:00");
      const room = ref("");
      const customDate = ref("");
      const colorCode = ref("");
  
      const submitTimetable = async () => {
        try {
          await createTimetableRequest(authStore.token, {
            course_name: courseName.value,
            professor_id: professorId.value,
            day_of_week: dayOfWeek.value,
            start_time: startTime.value,
            end_time: endTime.value,
            room: room.value,
            custom_date: customDate.value || null,
            color_code: colorCode.value || null,
          });
          alert("시간표가 등록되었습니다.");
          router.push("/timetables");
        } catch (error) {
          alert("시간표 등록 실패: " + (error.response?.data?.error || error.message));
        }
      };
  
      return {
        courseName, professorId, dayOfWeek, startTime, endTime, room,
        customDate, colorCode,
        submitTimetable,
      };
    },
  };
  </script>
  
  <style scoped>
  .timetable-form {
    margin: 20px;
  }
  </style>
  