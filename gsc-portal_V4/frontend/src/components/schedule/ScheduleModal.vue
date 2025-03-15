<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>시간표 등록 모달</h3>
      <label>학년</label>
      <select v-model="gradeYear">
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
      
      <label>요일</label>
      <select v-model="dayOfWeek">
        <option value="월">월</option>
        <option value="화">화</option>
        <option value="수">수</option>
        <option value="목">목</option>
        <option value="금">금</option>
        <option value="토">토</option>
      </select>

      <label>과목명</label>
      <input v-model="subjectName" type="text" placeholder="예) 알고리즘" />

      <label>교수명</label>
      <input v-model="professorName" type="text" placeholder="예) 홍길동" />

      <label>강의실</label>
      <input v-model="classroom" type="text" placeholder="예) A101" />

      <label>시작 시간</label>
      <input v-model="startTime" type="time" />

      <label>종료 시간</label>
      <input v-model="endTime" type="time" />

      <div class="button-group">
        <button @click="submitForm">등록하기</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { useScheduleStore } from "../../store/scheduleStore.js";

/**
 * 시간표 등록 모달
 * - 빈 칸 클릭 시 (day, hour) 정보가 props로 넘어옴
 * - 등록 시 createScheduleRequest 호출
 */
export default {
  name: "ScheduleModal",
  props: {
    selectedDay: { type: String, default: "월" },
    selectedHour: { type: Number, default: 9 },
  },
  emits: ["close","created"],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const scheduleStore = useScheduleStore();

    const gradeYear = ref("1");
    const dayOfWeek = ref(props.selectedDay);
    const subjectName = ref("");
    const professorName = ref("");
    const classroom = ref("");
    const startTime = ref("");
    const endTime = ref("");

    onMounted(() => {
      // 처음 모달 열 때, startTime ~ endTime 기본값 설정
      const hourStr = props.selectedHour < 10 ? `0${props.selectedHour}` : `${props.selectedHour}`;
      startTime.value = `${hourStr}:00`;
      endTime.value = `${hourStr}:50`;
    });

    const submitForm = async () => {
      try {
        if (!subjectName.value) {
          alert("과목명을 입력하세요.");
          return;
        }
        const payload = {
          subject_name: subjectName.value,
          professor_name: professorName.value || "교수 미지정",
          classroom: classroom.value || "강의실 미지정",
          day_of_week: dayOfWeek.value,
          start_time: startTime.value,
          end_time: endTime.value,
          grade_year: parseInt(gradeYear.value),
        };
        await scheduleStore.addSchedule(authStore.token, payload);
        alert("시간표 등록 완료!");
        emit("created");
      } catch (error) {
        alert("등록 오류: " + error.response?.data?.error);
      }
    };

    const closeModal = () => {
      emit("close");
    };

    return {
      gradeYear,
      dayOfWeek,
      subjectName,
      professorName,
      classroom,
      startTime,
      endTime,
      submitForm,
      closeModal,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: #fff;
  width: 350px;
  padding: 20px;
  border-radius: 8px;
}
.button-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
