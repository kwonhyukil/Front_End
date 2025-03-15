<!-- [경로: frontend/src/components/timetable/Timetable.vue] -->
<template>
    <div class="timetable-page">
      <h2>학과 시간표</h2>
  
      <!-- 날짜 선택 (일주일 단위로 표시) -->
      <div class="date-picker">
        <label>날짜 선택: </label>
        <input type="date" v-model="selectedDate" @change="onDateChange" />
      </div>
  
      <!-- 주간 범위 표시 -->
      <p>기간: {{ weekStart }} ~ {{ weekEnd }}</p>
  
      <!-- 1학년 / 2학년 / 3학년 등 (확장 가능, 예시는 role_id=2인 교수 전용) -->
      <div class="grade-tabs">
        <button :class="{active: activeGrade === 1}" @click="activeGrade=1">1학년</button>
        <button :class="{active: activeGrade === 2}" @click="activeGrade=2">2학년</button>
        <button :class="{active: activeGrade === 3}" @click="activeGrade=3">3학년</button>
      </div>
  
      <!-- 월~토 테이블 -->
      <table class="calendar-table">
        <thead>
          <tr>
            <th>시간\요일</th>
            <th v-for="(day,k) in days" :key="k">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- 예시: 09:00 ~ 18:00까지 1시간 단위 반복 -->
          <tr v-for="hour in hours" :key="hour">
            <td>{{ hour }}:00</td>
            <td v-for="(day, idx) in days" :key="idx" class="cell">
              <!-- 필터링된 과목 표시 -->
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
  
  /**
   * 요일별 + 시간대별로 시간표를 한눈에 보여주도록 테이블 형태로 구현
   * - custom_date가 있으면 해당 날짜에만 다른 과목(색상)을 표시
   */
  export default {
    name: "Timetable",
    setup() {
      const store = useTimetableStore();
  
      const selectedDate = ref("");
      const activeGrade = ref(1);  // 학년이나 분반 탭
      // 날짜 선택 시 1주 범위 계산
      const weekStart = ref("");
      const weekEnd = ref("");
  
      // 주로 월~토
      const days = ["월", "화", "수", "목", "금", "토"];
      // 예시 시간(9~18시)
      const hours = [9,10,11,12,13,14,15,16,17,18];
  
      // 초기 로드
      onMounted(async () => {
        // 전체 timetable 불러오기
        await store.loadAllTimetables();
        // 오늘 날짜 기본값
        const now = new Date();
        selectedDate.value = now.toISOString().split("T")[0];
        calcWeekRange(selectedDate.value);
      });
  
      // 날짜 변경 시 주간 범위 재계산
      const onDateChange = () => {
        calcWeekRange(selectedDate.value);
      };
  
      // 1주 범위 계산 (예시)
      const calcWeekRange = (dateStr) => {
        const d = new Date(dateStr);
        // 오늘 기준으로 해당 주(월~일) 시작과 끝 계산
        const dayOfWeek = d.getDay(); // 일(0) ~ 토(6)
        // 월요일을 1, 화요일 2...로 보고 계산
        const monDiff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        // 주 시작(월) / 끝(일) 예시
        const start = new Date(d.getTime() - monDiff * 24*60*60*1000);
        const end = new Date(start.getTime() + 6 * 24*60*60*1000);
  
        // yyyy-mm-dd 포맷
        const fmt = (val) => {
          const year = val.getFullYear();
          const month = ("0" + (val.getMonth()+1)).slice(-2);
          const day = ("0" + val.getDate()).slice(-2);
          return `${year}-${month}-${day}`;
        };
  
        weekStart.value = fmt(start);
        weekEnd.value = fmt(end);
      };
  
      // 시간표 필터
      const getTimetable = (day, hour) => {
        // 전체 timetable 중에서 day_of_week == day 인 것
        // 해당 hour가 start_time ~ end_time 사이에 있는지 등 추가 로직 가능
        // custom_date가 selectedDate.value와 같다면 우선표시
        return store.timetables.filter(item => {
          if (item.day_of_week !== day) return false;
          // custom_date 체크 (date가 null이거나, 선택된 날짜와 맞는지)
          if (item.custom_date) {
            if (item.custom_date !== selectedDate.value) {
              // custom_date가 있지만 지금 선택된 날짜가 아니면 표시 안함
              return false;
            }
          }
          // 시간대 포함 여부 (단순히 정수 비교 or substring으로 처리)
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
  