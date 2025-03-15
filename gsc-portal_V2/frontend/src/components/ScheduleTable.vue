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
          <tr v-for="time in times" :key="time.period">
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
                  <button class="delete-btn" @click="removeSchedule(getScheduleItem(day, Number(time.period)).id)">🗑 삭제</button>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
  
      <!-- 추가 모달 -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h3>시간표 추가</h3>
          <input v-model="newItem.course_name" placeholder="과목명" />
          <input v-model="newItem.professor" placeholder="교수명" />
          <input v-model="newItem.classroom" placeholder="강의실" />
          <select v-model="newItem.day">
            <option v-for="day in days" :key="day">{{ day }}</option>
          </select>
          <button class="save-btn" @click="saveSchedule">저장</button>
          <button class="cancel-btn" @click="closeModal">취소</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useAuthStore } from "../store/authStore";
  import { useScheduleStore } from "../store/ScheduleStore";
  
  const authStore = useAuthStore();
  const scheduleStore = useScheduleStore();
  
  const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const times = [...Array(10)].map((_, i) => ({ period: i + 1, label: `${9 + i}:00 ~ ${10 + i - 1}:50` }));
  
  const newItem = ref({ course_name: "", professor: "", classroom: "", day: "월요일" });
  const showModal = ref(false);
  
  // ✅ 관리자 여부 확인
  const isAdmin = computed(() => {
    return authStore.user?.role === "관리자" || authStore.user?.role === "교수";
  });
  
  // ✅ 시간표에서 특정 시간, 요일에 해당하는 항목 가져오기
  const getScheduleItem = computed(() => {
    return (day, period) => scheduleStore.schedule.find(item => item.day === day && item.period === period);
  });
  
  // ✅ 병합된 셀인지 확인 (연강 여부 판단)
  const isMergedCell = (day, period) => {
    if (period === 1) return false;
    const previousItem = getScheduleItem.value(day, period - 1);
    return previousItem && previousItem.duration > 50;
  };
  
  // ✅ rowspan 값 반환 (연강인 경우)
  const getRowSpan = (day, period) => {
    const item = getScheduleItem.value(day, period);
    return item ? item.duration / 50 : 1;
  };
  
  // ✅ 배경 색상 랜덤 적용
  const colors = ["#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#BBDEFB", "#C8E6C9", "#FFECB3", "#D7CCC8"];
  const getRandomColor = (day, period) => {
    const item = getScheduleItem.value(day, period);
    if (!item) return "transparent";
    const index = (days.indexOf(day) + period) % colors.length;
    return colors[index];
  };
  
  // ✅ 새 시간표 추가
  const saveSchedule = async () => {
    if (!newItem.value.course_name || !newItem.value.professor || !newItem.value.classroom) {
      alert("⚠️ 모든 필드를 입력해야 합니다!");
      return;
    }
    await scheduleStore.addSchedule(newItem.value);
    closeModal();
  };
  
  // ✅ 시간표 삭제
  const removeSchedule = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await scheduleStore.deleteSchedule(id);
  };
  
  // ✅ 모달 닫기 및 입력값 초기화
  const closeModal = () => {
    newItem.value = { course_name: "", professor: "", classroom: "", day: "월요일" };
    showModal.value = false;
  };
  
  // ✅ 시간표 불러오기
  onMounted(() => {
    scheduleStore.loadSchedule();
  });
  </script>
  
  <style scoped>
  /* 기존 스타일 유지 */
  .schedule {
    margin-top: 80px;
    text-align: center;
  }
  
  table {
    margin: 20px auto;
    border-collapse: collapse;
    width: 100%;
    max-width: 1400px;
    table-layout: fixed;
  }
  
  th, td {
    border: 1px solid #ccc;
    padding: 12px;
    text-align: center;
    font-size: 14px;
    white-space: nowrap;
    vertical-align: middle;
  }
  
  thead {
    background-color: #f5f5f5;
  }
  
  /* 모달 스타일 */
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background: white;
    width: 500px;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0,0,0,0.3);
  }
  
  .modal-content h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .modal-content input,
  .modal-content select {
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .modal-buttons button {
    width: 48%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
  }
  
  .save-btn {
    background-color: #007bff;
    color: white;
  }
  
  .cancel-btn {
    background-color: #dc3545;
    color: white;
  }
  </style>
  