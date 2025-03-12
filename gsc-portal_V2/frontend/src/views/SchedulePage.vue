<template>
  <div class="schedule">
    <h2>📆 학과 시간표</h2>
    <button v-if="isAdmin" @click="showModal = true">➕ 시간표 추가</button>

    <!-- 시간표 테이블 -->
    <table>
      <thead>
        <tr>
          <th>시간</th>
          <th v-for="day in days" :key="day">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time) in times" :key="time.period">
          <td>
            <strong>주-{{ time.period }}</strong> <br /> {{ time.label }}
          </td>
          <template v-for="day in days" :key="day">
            <td v-if="!isMergedCell(day, Number(time.period))"
                :rowspan="getRowSpan(day, Number(time.period))"
                :style="{ backgroundColor: getRandomColor(day, Number(time.period)) }">
              <div v-if="getScheduleItem(day, Number(time.period))">
                <strong>{{ getScheduleItem(day, Number(time.period))?.course_name }}</strong>
                <p>({{ getScheduleItem(day, Number(time.period))?.professor }})</p>
                <p>{{ getScheduleItem(day, Number(time.period))?.classroom }}</p>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

    <!-- 📌 추가 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>시간표 추가</h3>
        <input v-model="newItem.course_name" placeholder="과목명" />
        <input v-model="newItem.professor" placeholder="교수명" />
        <input v-model="newItem.classroom" placeholder="강의실" />
        <select v-model="newItem.day">
          <option v-for="day in days" :key="day">{{ day }}</option>
        </select>
        <select v-model="newItem.period">
          <option v-for="(time) in times" :key="time.period" :value="time.period">
            주-{{ time.period }} ({{ time.label }})
          </option>
        </select>
        <select v-model="newItem.duration">
          <option value="50">50분</option>
          <option value="100">100분</option>
        </select>
        <div class="modal-buttons">
          <button class="save-btn" @click="addSchedule">저장</button>
          <button class="cancel-btn" @click="showModal = false">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const times = [
  { period: 1, label: "09:00 ~ 09:50" },
  { period: 2, label: "10:00 ~ 10:50" },
  { period: 3, label: "11:00 ~ 11:50" },
  { period: 4, label: "12:00 ~ 12:50" },
  { period: 5, label: "13:00 ~ 13:50" },
  { period: 6, label: "14:00 ~ 14:50" },
  { period: 7, label: "15:00 ~ 15:50" },
  { period: 8, label: "16:00 ~ 16:50" },
  { period: 9, label: "17:00 ~ 17:50" },
  { period: 10, label: "18:00 ~ 18:50" }
];

const schedule = ref([]);
const showModal = ref(false);
const newItem = ref({ course_name: "", professor: "", classroom: "", day: "월요일", period: 1, duration: 50 });

const user = computed(() => authStore.user ?? {});
const isAdmin = computed(() => user.value?.role === "관리자" || user.value?.role === "교수");

const fetchSchedule = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 인증 토큰이 없습니다.");
      return;
    }

    const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/schedule", {
      headers: { Authorization: `Bearer ${token}` }
    });

    // 🔹 데이터 변환 (period를 숫자로 변환)
    schedule.value = res.data.schedule.map(item => ({
      ...item,
      day: item.day.trim(), // 🔹 day의 공백 제거
      period: Number(item.period) // 🔹 period를 숫자로 변환하여 저장
    }));

    console.log("✅ 시간표 불러오기 성공:", schedule.value);
  } catch (error) {
    console.error("❌ 시간표 불러오기 오류:", error.response?.data || error);
  }
};

const getScheduleItem = (day, period) => {
  console.log(`🔍 Searching for day: ${day}, period: ${period}`); // 디버깅
  return schedule.value.find(item => item.day.trim() === day.trim() && Number(item.period) === Number(period));
};

const getRowSpan = (day, period) => {
  const item = getScheduleItem(day, period);
  return item ? item.duration / 50 : 1;
};

const isMergedCell = (day, period) => {
  if (period === 1) return false;
  const previousItem = getScheduleItem(day, period - 1);
  return previousItem && previousItem.duration > 50;
};

// ✅ `getRandomColor` 함수 추가
const colors = ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#BBDEFB", "#C8E6C9", "#FFECB3", "#D7CCC8"];
const getRandomColor = (day, period) => {
  const item = getScheduleItem(day, period);
  if (!item) return "transparent";
  const index = (days.indexOf(day) + period) % colors.length;
  return colors[index];
};

const addSchedule = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("🚨 인증이 필요합니다.");
      return;
    }

    await axios.post(import.meta.env.VITE_BACKEND_URL + "/schedule", newItem.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("시간표가 추가되었습니다.");
    showModal.value = false;
    fetchSchedule();
  } catch (error) {
    console.error("시간표 추가 오류:", error);
  }
};

onMounted(async () => {
  await authStore.fetchUser();
  fetchSchedule();
});
</script>

  <style scoped>
  /* 기본 테이블 스타일 */
  .schedule {
    margin-top: 80px;
    text-align: center;
  }
  
  table {
    margin: 20px auto;
    border-collapse: collapse;
    width: 120%; /* 기존보다 넓게 조정 */
    max-width: 1400px; /* 가로 길이를 늘림 */
    table-layout: fixed;
  }
  
  th, td {
    border: 1px solid #ccc;
    padding: 18px; /* 내부 여백 확대 */
    text-align: center;
    font-size: 14px; /* 글씨 크기 조정 */
    white-space: nowrap;
    vertical-align: middle;
  }
  
  /* 헤더 스타일 */
  thead {
    background-color: #f5f5f5;
  }
  
  /* 연강(2시간 이상) 칸 스타일 */
  td[rowspan] {
    vertical-align: middle;
    font-weight: bold;
  }
  
  /* 강의칸 스타일 */
  .schedule-item {
    padding: 12px;
    border-radius: 6px;
    color: #333;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }
  
  /* 배경색 랜덤 적용 */
  .schedule-item:nth-child(1) { background-color: #FFCDD2; }
  .schedule-item:nth-child(2) { background-color: #F8BBD0; }
  .schedule-item:nth-child(3) { background-color: #E1BEE7; }
  .schedule-item:nth-child(4) { background-color: #D1C4E9; }
  .schedule-item:nth-child(5) { background-color: #BBDEFB; }
  .schedule-item:nth-child(6) { background-color: #C8E6C9; }
  .schedule-item:nth-child(7) { background-color: #FFECB3; }
  .schedule-item:nth-child(8) { background-color: #D7CCC8; }
  
/* 모달 전체 배경 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 모달 컨텐츠 */
.modal-content {
  background: white;
  width: 500px; /* 가로 길이 확장 */
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
}

/* 제목 스타일 */
.modal-content h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 입력 필드 스타일 */
.modal-content input,
.modal-content select {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

/* 버튼 컨테이너 */
.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

/* 저장 버튼 */
.modal-buttons button {
  width: 48%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

/* 저장 버튼 스타일 */
.modal-buttons .save-btn {
  background-color: #007bff;
  color: white;
}

.modal-buttons .save-btn:hover {
  background-color: #0056b3;
}

/* 취소 버튼 스타일 */
.modal-buttons .cancel-btn {
  background-color: #dc3545;
  color: white;
}

.modal-buttons .cancel-btn:hover {
  background-color: #a71d2a;
}
</style>