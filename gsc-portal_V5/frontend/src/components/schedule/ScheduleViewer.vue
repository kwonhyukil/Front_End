<template>
  <div class="schedule-viewer container">
    <h2>학과 시간표</h2>
    <!-- 학년 필터 -->
    <div class="grade-select">
      <button :class="{active: selectedGrade==='all'}" @click="changeGrade('all')">전체</button>
      <button :class="{active: selectedGrade==='1'}" @click="changeGrade('1')">1학년</button>
      <button :class="{active: selectedGrade==='2'}" @click="changeGrade('2')">2학년</button>
      <button :class="{active: selectedGrade==='3'}" @click="changeGrade('3')">3학년</button>
    </div>

    <!-- 실제 시간표 테이블 -->
    <div class="timetable">
      <table class="time-table">
        <thead>
          <tr>
            <th class="time-col">교시 / 시간</th>
            <th v-for="(day, idx) in days" :key="idx">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- 시간대 예시: 09:00~21:00 -->
          <tr v-for="hour in hours" :key="hour">
            <td class="hour-cell">{{ hour }}:00 ~ {{ hour+1 }}:00</td>
            <td
              v-for="(day) in days"
              :key="day"
              class="schedule-cell"
              @click="cellClick(day, hour)"
            >
              <!-- 필터된 수업 목록(중첩 표시 가능) -->
              <div
                v-for="(item, i) in getClasses(day, hour)"
                :key="i"
                class="class-box"
              >
                <strong>{{ item.course_name }}</strong><br />
                {{ item.professor_name }} ({{ item.room }})
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 모달 (관리자/교수만) -->
    <ScheduleModal
      v-if="showModal && canEdit"
      :day="selectedDay"
      :hour="selectedHour"
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
    const days = ["월","화","수","목","금","토"];
    const hours = [9,10,11,12,13,14,15,16,17,18,19,20]; // 9~20시
    const selectedGrade = ref("all");
    const scheduleStore = useScheduleStore();
    const authStore = useAuthStore();
    const showModal = ref(false);
    const selectedDay = ref("월");
    const selectedHour = ref(9);

    // 관리자/교수 권한 여부
    const canEdit = computed(() => authStore.isAdmin || authStore.isProfessor);

    const loadData = async () => {
      console.log("🟡 loadData() 실행"); // 실행 여부 확인
      await scheduleStore.loadSchedules(selectedGrade.value);
      console.log("🟢 schedules:", scheduleStore.schedules); // 데이터 확인
    };
    onMounted(() => {
      console.log("🟢 ScheduleViewer Mounted"); // 확인 로그 추가
      loadData()
    });

    const changeGrade = (g) => {
      selectedGrade.value = g;
      loadData();
    };
    const getClasses = (day, hour) => {
      // scheduleStore.schedules에서 day_of_week===day & start_time~end_time이 hour에 해당
      return scheduleStore.schedules.filter(s => {
        if(s.day_of_week!==day) return false;
        const startH= parseInt(s.start_time.split(":")[0]);
        const endH= parseInt(s.end_time.split(":")[0]);
        return hour>=startH && hour<endH;
      });
    };
    const cellClick = (day, hour) => {
      if(!canEdit.value) return;
      selectedDay.value=day;
      selectedHour.value=hour;
      showModal.value=true;
    };
    const handleCreated = () => {
      showModal.value=false;
      loadData();
    };
    const closeModal=()=>{
      showModal.value=false;
    };
    const reloadSchedules=()=>{
      // 새로 등록된 시간표 즉시 반영
      loadData();
      closeModal();
    };

    return {
      days, hours, selectedGrade, showModal, selectedDay, selectedHour,
      changeGrade, getClasses, cellClick, handleCreated,
      canEdit, scheduleStore, authStore,reloadSchedules,
    };
  },
};
</script>

<style scoped>
.schedule-viewer {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.grade-select {
  margin-bottom: 15px;
}
.grade-select button.active {
  background: #28a745;
}
.time-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
.time-col {
  width: 120px;
  background: #f3f3f3;
  text-align: center;
  font-weight: bold;
}
.hour-cell {
  text-align: center;
  border: 1px solid #e0e0e0;
  width: 120px;
}
.schedule-cell {
  border: 1px solid #e0e0e0;
  position: relative;
  height: 80px;
  vertical-align: top;
  cursor: pointer;
}
.schedule-cell:hover {
  background: #f9f9f9;
}
.class-box {
  background: #cfe9ff;
  margin: 2px;
  padding: 4px;
  border-radius: 4px;
  font-size: 0.9rem;
}
.class-box strong {
  color: #333;
}
</style>
