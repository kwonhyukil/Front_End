<template>
  <div class="schedule-viewer-container">
    <h2>학과 시간표</h2>

    <!-- 학년 선택 드롭다운 -->
    <div class="grade-select">
      <label>학년:</label>
      <select v-model="selectedGrade" @change="loadData">
        <option value="all">전체</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>
    </div>

    <!-- 시간표 테이블 (월~토) -->
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
          <!-- 09:00 ~ 18:00 시간대별 행 -->
          <tr v-for="hour in hours" :key="hour">
            <td class="time-cell">{{ hour }}:00</td>
            <!-- 요일별 칸 -->
            <td v-for="(day,index) in days" :key="index" class="schedule-cell"
                @click="openModal(day, hour)">
              <!-- 특정 시간대에 존재하는 과목 표시 -->
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

    <!-- 시간표 등록 모달 (관리자/교수만 사용 가능) -->
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
    const scheduleStore = useScheduleStore(); // 시간표 데이터 관리
    const authStore = useAuthStore(); // 사용자 인증 정보 관리

    const selectedGrade = ref("all"); // 선택한 학년 (기본: 전체)
    const showModal = ref(false); // 모달 표시 여부
    const modalDay = ref("월"); // 모달에 전달할 선택한 요일
    const modalHour = ref(9); // 모달에 전달할 선택한 시간

    const days = ["월","화","수","목","금","토"]; // 요일 목록
    const hours = [9,10,11,12,13,14,15,16,17,18]; // 9시~18시 (시간표 표시)

    // 관리자 또는 교수 여부
    const isAdminOrProfessor = computed(() => authStore.isAdmin || authStore.isProfessor);

    /**
     * 📌 학년별 시간표 데이터 불러오기
     */
    const loadData = async () => {
      await scheduleStore.loadSchedules(selectedGrade.value);
    };

    /**
     * 📌 특정 요일 & 시간에 해당하는 과목 필터링
     * - 시간표 데이터에서 해당 요일과 시간에 존재하는 수업만 필터링
     */
    const getSchedules = (day, hour) => {
      return scheduleStore.schedules.filter(sch => {
        if (sch.day_of_week !== day) return false; // 요일이 다르면 제외
        const startH = parseInt(sch.start_time.split(":")[0]); // 시작 시간 (시간만 추출)
        const endH = parseInt(sch.end_time.split(":")[0]); // 종료 시간 (시간만 추출)
        return hour >= startH && hour < endH; // 해당 시간이 수업 범위에 포함되는지 확인
      });
    };

    /**
     * 📌 빈칸 클릭 시 모달 열기
     * - 관리자/교수만 사용 가능
     */
    const openModal = (day, hour) => {
      if (!isAdminOrProfessor.value) return; // 권한 없으면 실행 안 함
      modalDay.value = day;
      modalHour.value = hour;
      showModal.value = true;
    };

    /**
     * 📌 모달에서 등록 완료 후, 시간표 새로고침
     */
    const handleCreated = () => {
      showModal.value = false;
      loadData();
    };

    /**
     * 📌 컴포넌트 마운트 시 데이터 로드
     */
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
/* 전체 컨테이너 스타일 */
.schedule-viewer-container {
  margin: 20px;
  overflow-x: auto; /* 가로 스크롤 */
}

/* 표 스타일 */
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

/* 시간 열 스타일 */
.time-cell {
  background: #f2f2f2;
  font-weight: bold;
}

/* 과목 블록 */
.subject-box {
  background: #eafcff;
  margin: 2px 0;
  padding: 2px;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* 학년 선택 드롭다운 */
.grade-select {
  margin-bottom: 10px;
}
</style>
