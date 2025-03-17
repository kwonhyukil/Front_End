<!-- 📄 Timetable.vue -->
<template>
  <div class="timetable-page">
    <h2>학과 시간표</h2>

    <!-- 📌 날짜 선택 (일주일 단위로 표시) -->
    <div class="date-picker">
      <label>날짜 선택: </label>
      <input type="date" v-model="selectedDate" @change="onDateChange" />
    </div>

    <!-- 📌 선택한 날짜 기준 주간 범위 표시 -->
    <p>기간: {{ weekStart }} ~ {{ weekEnd }}</p>

    <!-- 📌 학년 선택 (확장 가능) -->
    <div class="grade-tabs">
      <button :class="{active: activeGrade === 1}" @click="activeGrade=1">1학년</button>
      <button :class="{active: activeGrade === 2}" @click="activeGrade=2">2학년</button>
      <button :class="{active: activeGrade === 3}" @click="activeGrade=3">3학년</button>
    </div>

    <!-- 📌 주간 시간표 테이블 (월~토) -->
    <table class="calendar-table">
      <thead>
        <tr>
          <th>시간\요일</th>
          <th v-for="(day,k) in days" :key="k">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- 09:00 ~ 18:00까지 1시간 단위 -->
        <tr v-for="hour in hours" :key="hour">
          <td>{{ hour }}:00</td>
          <td v-for="(day, idx) in days" :key="idx" class="cell">
            <!-- 📌 해당 시간대의 과목 표시 -->
            <div 
              v-for="timeItem in getTimetable(day, hour)"
              :key="timeItem.id"
              :style="{ backgroundColor: timeItem.color_code || '#fff' }"
              class="course-item"
            >
              {{ timeItem.course_name }}<br/>
              ({{ timeItem.start_time }}~{{ timeItem.end_time }})
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useTimetableStore } from "../../store/timetableStore.js";

export default {
  name: "Timetable",
  setup() {
      const store = useTimetableStore(); // 시간표 스토어 사용

      const selectedDate = ref(""); // 선택한 날짜
      const activeGrade = ref(1);  // 학년 선택 (기본값: 1학년)
      const weekStart = ref(""); // 주간 시작일
      const weekEnd = ref(""); // 주간 종료일

      const days = ["월", "화", "수", "목", "금", "토"]; // 요일 목록
      const hours = [9,10,11,12,13,14,15,16,17,18]; // 9시~18시 (시간표 표시)

      /**
       * 📌 컴포넌트 마운트 시 실행
       * - 전체 시간표 데이터를 불러오고, 기본 날짜를 설정
       */
      onMounted(async () => {
          await store.loadAllTimetables(); // 전체 시간표 데이터 로드
          const now = new Date();
          selectedDate.value = now.toISOString().split("T")[0]; // 오늘 날짜 설정
          calcWeekRange(selectedDate.value); // 주간 범위 계산
      });

      /**
       * 📌 날짜 변경 시 실행
       * - 새로운 주간 범위를 계산
       */
      const onDateChange = () => {
          calcWeekRange(selectedDate.value);
      };

      /**
       * 📌 주간 범위 계산
       * - 선택한 날짜를 기준으로 해당 주의 월~일 범위를 계산
       */
      const calcWeekRange = (dateStr) => {
          const d = new Date(dateStr);
          const dayOfWeek = d.getDay(); // 요일 (0: 일요일 ~ 6: 토요일)
          const monDiff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 월요일까지 거리
          const start = new Date(d.getTime() - monDiff * 24 * 60 * 60 * 1000); // 월요일
          const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000); // 일요일

          // yyyy-mm-dd 포맷으로 변환
          const fmt = (val) => {
              const year = val.getFullYear();
              const month = ("0" + (val.getMonth() + 1)).slice(-2);
              const day = ("0" + val.getDate()).slice(-2);
              return `${year}-${month}-${day}`;
          };

          weekStart.value = fmt(start);
          weekEnd.value = fmt(end);
      };

      /**
       * 📌 시간표 데이터 필터링
       * - 요일과 시간대를 기준으로 해당하는 과목만 필터링
       */
      const getTimetable = (day, hour) => {
          return store.timetables.filter(item => {
              if (item.day_of_week !== day) return false;
              if (item.custom_date && item.custom_date !== selectedDate.value) return false; // 특정 날짜에만 적용되는 과목 처리
              const startH = parseInt(item.start_time.split(":")[0]);
              const endH = parseInt(item.end_time.split(":")[0]);
              return hour >= startH && hour < endH;
          });
      };

      return {
          selectedDate,
          weekStart,
          weekEnd,
          activeGrade,
          days,
          hours,
          onDateChange,
          getTimetable,
      };
  },
};
</script>

<style scoped>
.timetable-page {
  margin: 20px;
}
.date-picker {
  margin-bottom: 10px;
}
.grade-tabs {
  margin: 10px 0;
}
.grade-tabs button {
  margin-right: 5px;
  padding: 6px 12px;
  cursor: pointer;
}
.grade-tabs .active {
  background: #007bff;
  color: #fff;
}
.calendar-table {
  width: 100%;
  border-collapse: collapse;
}
.calendar-table th, .calendar-table td {
  border: 1px solid #ccc;
  padding: 8px;
  vertical-align: top;
  width: 14%;
}
.course-item {
  border: 1px solid #999;
  margin: 4px 0;
  padding: 4px;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
