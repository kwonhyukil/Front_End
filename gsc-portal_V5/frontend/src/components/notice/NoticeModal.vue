<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content schedule-modal">
      <h3>시간표 등록</h3>

      <!-- 요일 선택 -->
      <label>요일</label>
      <select v-model="dayOfWeek">
        <option v-for="d in days" :key="d" :value="d">{{ d }}</option>
      </select>

      <!-- 시작/종료 시간 -->
      <label>시작 시간</label>
      <input type="time" v-model="startTime" />
      <label>종료 시간</label>
      <input type="time" v-model="endTime" />

      <!-- 과목명 -->
      <label>과목명</label>
      <input v-model="courseName" />

      <!-- 교수 선택 -->
      <label>교수</label>
      <select v-model="professorId">
        <option disabled value="">교수를 선택하세요</option>
        <option v-for="p in professors" :key="p.id" :value="p.id">{{ p.name }}</option>
      </select>

      <!-- 강의실 -->
      <label>강의실</label>
      <input v-model="room" />

      <!-- 색상 선택 -->
      <label>색상</label>
      <input type="color" v-model="colorCode" />

      <!-- 버튼 -->
      <div class="button-group">
        <button @click="submitForm">등록</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { useTimetableStore } from "../../store/timetableStore.js";
import axios from "axios";

const props = defineProps(["day", "hour", "grade"]);
const emit = defineEmits(["close", "created"]);

const days = ["월", "화", "수", "목", "금", "토"];

// 상태 변수
const courseName = ref("");
const professorId = ref("");
const room = ref("");
const colorCode = ref("#cfe9ff");
const startTime = ref("");
const endTime = ref("");
const dayOfWeek = ref("");
const gradeId = ref("1");

const professors = ref([]);

const store = useTimetableStore();
const auth = useAuthStore();

onMounted(async () => {
  // 기본값 세팅
  if (props.day) dayOfWeek.value = props.day;
  if (props.hour) {
    const hh = String(props.hour).padStart(2, "0");
    startTime.value = `${hh}:00`;
    endTime.value = `${String(props.hour + 1).padStart(2, "0")}:00`;
  }
  if (props.grade) gradeId.value = String(props.grade);

  // 교수 목록 불러오기
  await loadProfessors();
});

const loadProfessors = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
      params: { role: 2 },
    });
    professors.value = res.data;
  } catch (err) {
    alert("교수 목록 로딩 실패");
    console.error("❌ 교수 목록 로딩 실패", err);
  }
};

const submitForm = async () => {
  try {
    const payload = {
      course_name: courseName.value,
      professor_id: Number(professorId.value),
      day_of_week: dayOfWeek.value,
      start_time: startTime.value,
      end_time: endTime.value,
      room: room.value,
      grade_id: Number(gradeId.value),
      color_code: colorCode.value,
    };

    console.log("🚀 등록 payload:", payload);

    await store.createTimetable(auth.token, payload, gradeId.value);
    emit("created");
  } catch (e) {
    console.error("❌ 등록 실패", e);
    alert("등록 실패: " + (e.response?.data?.error || e.message));
  }
};

const closeModal = () => emit("close");
</script>

<style scoped>
.schedule-modal label {
  display: block;
  margin-top: 8px;
  font-weight: bold;
}
.schedule-modal input,
.schedule-modal select {
  width: 100%;
  margin-bottom: 6px;
  padding: 6px;
}
.button-group {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
