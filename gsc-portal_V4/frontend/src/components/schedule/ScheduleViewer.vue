<template>
  <div class="schedule-viewer-container">
    <h2>학과 시간표</h2>

    <!-- 학년 선택 -->
    <div class="grade-select">
      <label>학년:</label>
      <select v-model="selectedGrade" @change="loadData">
        <option value="all">전체</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
    </div>

    <!-- 표 형식 (월~토) -->
    <div class="schedule-table-wrapper">
      <table class="schedule-table">
        <thead>
          <tr>
            <th>시간</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
          </tr>
        </thead>
        <tbody>
          <!-- 예: 09:00 ~ 18:00까지 1시간 단위로 편성 -->
          <tr v-for="hour in hours" :key="hour">
            <td class="time-cell">{{ hour }}:00</td>
            <!-- 요일별 칸 -->
            <td v-for="(day,index) in days" :key="index" class="schedule-cell"
                @click="openModal(day, hour)">
              <!-- 해당 시간대에 존재하는 과목 표시 -->
              <div
                v-for="item in getSchedules(day, hour)"
                :key="item.id"
                class="subject-box"
              >
                {{ item.subject_name }}
                <br />
                ({{ item.start_time }}~{{ item.end_time }})
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 등록 모달 (관리자/교수만) -->
    <ScheduleModal
      v-if="showModal && isAdminOrProfessor"
      :selectedDay="modalDay"
      :selectedHour="modalHour"
      @close="showModal=false"
      @created="handleCreated"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useScheduleStore } from "../../store/scheduleStore.js";
import { useAuthStore } from "../../store/authStore.js";
import ScheduleModal from "./ScheduleModal.vue";

export default {
  name: "ScheduleViewer",
  components: { ScheduleModal },
  setup() {
    const scheduleStore = useScheduleStore();
    const authStore = useAuthStore();

    const selectedGrade = ref("all");
    const showModal = ref(false);
    const modalDay = ref("월");
    const modalHour = ref(9);

    const days = ["월","화","수","목","금","토"];
    // 9시~18시
    const hours = [9,10,11,12,13,14,15,16,17,18];

    const isAdminOrProfessor = computed(() => authStore.isAdmin || authStore.isProfessor);

    // 시간표 데이터 로드
    const loadData = async () => {
      await scheduleStore.loadSchedules(selectedGrade.value);
    };

    // 해당 day, hour에 해당하는 과목들 필터링
    const getSchedules = (day, hour) => {
      return scheduleStore.schedules.filter(sch => {
        if (sch.day_of_week !== day) return false;
        const startH = parseInt(sch.start_time.split(":")[0]);
        const endH = parseInt(sch.end_time.split(":")[0]);
        return hour >= startH && hour < endH;
      });
    };

    // 모달 열기 (빈칸 클릭)
    const openModal = (day, hour) => {
      if (!isAdminOrProfessor.value) return; // 권한 없는 경우 무시
      modalDay.value = day;
      modalHour.value = hour;
      showModal.value = true;
    };

    // 모달에서 등록 후
    const handleCreated = () => {
      showModal.value = false;
      loadData();
    };

    onMounted(() => {
      loadData();
    });

    return {
      selectedGrade,
      showModal,
      modalDay,
      modalHour,
      days,
      hours,
      isAdminOrProfessor,
      loadData,
      getSchedules,
      openModal,
      handleCreated,
    };
  },
};
</script>

<style scoped>
.schedule-viewer-container {
  margin: 20px;
  overflow-x: auto; /* 가로 스크롤 */
}

/* 반응형 CSS 예시 */
.schedule-table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: #fff;
}

.schedule-table {
  border-collapse: collapse;
  min-width: 800px; /* 가로 스크롤 */
}
.schedule-table th,
.schedule-table td {
  border: 1px solid #ccc;
  text-align: center;
  width: 150px;
  height: 60px;
  vertical-align: top;
  padding: 4px;
}
.time-cell {
  background: #f2f2f2;
  font-weight: bold;
}
.subject-box {
  background: #eafcff;
  margin: 2px 0;
  padding: 2px;
  border-radius: 4px;
  font-size: 0.9rem;
}
.grade-select {
  margin-bottom: 10px;
}
</style>
