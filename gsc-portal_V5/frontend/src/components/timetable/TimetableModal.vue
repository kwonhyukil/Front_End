
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content schedule-modal">
      <h3>시간표 등록</h3>

      <label>요일</label>
      <select v-model="dayOfWeek">
        <option v-for="d in days" :key="d">{{ d }}</option>
      </select>

      <label>시작 시간</label>
      <input type="time" v-model="startTime" />

      <label>종료 시간</label>
      <input type="time" v-model="endTime" />

      <label>과목명</label>
      <input v-model="courseName" />

      <label>교수명</label>
      <select v-model="professorId">
        <option disabled value="">교수 선택</option>
        <option v-for="prof in professors" :key="prof.id" :value="prof.id">
          {{ prof.name }}
        </option>
      </select>

      <label>강의실</label>
      <input v-model="room" />

      <label>색상</label>
      <input type="color" v-model="colorCode" />

      <label>수업 유형</label>
      <select v-model="scheduleType">
        <option>일반</option>
        <option>보강</option>
        <option>휴강</option>
        <option>특강</option>
      </select>

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
import { fetchProfessors } from "../../api/user.js";

const props = defineProps(["day", "hour", "grade", "week"]);
const emit = defineEmits(["close", "created"]);

const courseName = ref("");
const professorId = ref("");
const room = ref("");
const dayOfWeek = ref(props.day || "월");
const startTime = ref("");
const endTime = ref("");
const colorCode = ref("#cfe9ff");
const scheduleType = ref("일반");
const gradeId = ref(props.grade || "1");

const professors = ref([]);
const auth = useAuthStore();
const store = useTimetableStore();

const days = ["월", "화", "수", "목", "금", "토"];

function calculateDateByWeekAndDay(weekNumber, dayOfWeek) {
  const days = ["월", "화", "수", "목", "금", "토"];
  const start = new Date("2025-03-03");
  const dayOffset = days.indexOf(dayOfWeek);
  if (dayOffset === -1) throw new Error("Invalid dayOfWeek");
  const date = new Date(start);
  date.setDate(date.getDate() + (weekNumber - 1) * 7 + dayOffset);
  return date.toISOString().split("T")[0];
}

const getProfessorNameById = (id) => {
  const found = professors.value.find((p) => p.id === Number(id));
  return found?.name || "";
};

onMounted(async () => {
  if (props.hour) {
    const h = String(props.hour).padStart(2, "0");
    startTime.value = `${h}:00`;
    endTime.value = `${String(props.hour + 1).padStart(2, "0")}:00`;
  }

  try {
    professors.value = await fetchProfessors();
  } catch (err) {
    console.error("❌ 교수 목록 로딩 실패", err);
    alert("교수 목록을 불러오는 데 실패했습니다.");
  }
});

const submitForm = async () => {
  try {
    if (!courseName.value || !professorId.value || !room.value) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    let customDate = null;
    const weekNumber = Number(props.week || "1");

    if (scheduleType.value !== "일반") {
      if (!["월", "화", "수", "목", "금", "토"].includes(dayOfWeek.value)) {
        alert("요일 값이 유효하지 않습니다.");
        return;
      }
      customDate = calculateDateByWeekAndDay(weekNumber, dayOfWeek.value);
    }

    const payload = {
      course_name: courseName.value,
      professor_id: Number(professorId.value),
      professor_name: getProfessorNameById(professorId.value),
      day_of_week: dayOfWeek.value,
      start_time: startTime.value,
      end_time: endTime.value,
      room: room.value,
      grade_id: Number(gradeId.value),
      color_code: colorCode.value,
      schedule_type: scheduleType.value,
      custom_date: customDate,
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
