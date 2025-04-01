<template>
  <div class="schedule-viewer container">
    <h2>학년별 시간표</h2>

    <!-- 학년 선택 -->
    <div class="grade-select">
      <button :class="{ active: selectedGrade === '1' }" @click="changeGrade('1')">1학년</button>
      <button :class="{ active: selectedGrade === '2' }" @click="changeGrade('2')">2학년</button>
      <button :class="{ active: selectedGrade === '3' }" @click="changeGrade('3')">3학년</button>
    </div>

    <!-- 주차 선택 -->
    <div class="week-select">
      <label>주차 선택:</label>
      <select v-model="selectedWeek" @change="loadData">
        <option v-for="week in 16" :key="week" :value="week">{{ week }}주차</option>
      </select>
    </div>

    <!-- 주차 날짜 표시 -->
    <div class="week-range">
      <p>{{ selectedWeek }}주차 ({{ weekRange.start }} ~ {{ weekRange.end }})</p>
    </div>

    <!-- 시간표 출력 -->
    <div class="timetable">
      <table class="time-table">
        <thead>
          <tr>
            <th class="time-col">교시 / 시간</th>
            <th v-for="(d, idx) in weekRange.dates" :key="idx">{{ d.day }}<br>{{ d.date }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hour in hours" :key="hour">
            <td class="hour-cell">{{ hour }}:00 ~ {{ hour + 1 }}:00</td>
            <td
              v-for="(d) in weekRange.dates"
              :key="d.date"
              class="schedule-cell"
              @click="cellClick(d.day, hour, d.date)"
            >
              <div
                v-for="(item, i) in getClasses(d.day, hour, d.date)"
                :key="i"
                class="class-box"
                :style="{ backgroundColor: getColor(item) }"
              >
                <strong>{{ getPrefix(item.schedule_type) }}{{ item.course_name }}</strong><br />
                교수: {{ item.professor_name || '미지정' }}<br />
                {{ item.room }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 모달 -->
    <TimetableModal
      v-if="showModal && canEdit"
      :day="selectedDay"
      :hour="selectedHour"
      :grade="selectedGrade"
      :date="selectedDate"
      @close="showModal = false"
      @created="handleCreated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTimetableStore } from '../../store/timetableStore.js';
import { useAuthStore } from '../../store/authStore.js';
import TimetableModal from './TimetableModal.vue';

const store = useTimetableStore();
const auth = useAuthStore();

const days = ['월', '화', '수', '목', '금', '토'];
const hours = [9,10,11,12,13,14,15,16,17,18];

const selectedGrade = ref('1');
const selectedWeek = ref(1);
const selectedDay = ref('월');
const selectedHour = ref(9);
const selectedDate = ref('');
const showModal = ref(false);

const canEdit = computed(() => auth.isAdmin || auth.isProfessor);

// 학기 시작일
const semesterStart = new Date('2025-03-03');

// 주차 날짜 계산
const getWeekRange = (weekNumber) => {
  const start = new Date(semesterStart);
  start.setDate(start.getDate() + (weekNumber - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 5); // 월~토

  const format = (date) => date.toISOString().split('T')[0];
  const daysKor = ['월','화','수','목','금','토','일'];

  return {
    start: format(start),
    end: format(end),
    dates: Array.from({ length: 6 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        date: format(d),
        day: daysKor[i],
      };
    }),
  };
};

const weekRange = ref(getWeekRange(selectedWeek.value));

// 수업 필터링
const formatDate = (date) => new Date(date).toISOString().split('T')[0];

const getClasses = (day, hour, date) => {
  const currentDate = formatDate(date);
  return store.timetables.filter(item => {
    if (Number(selectedGrade.value) !== item.grade_id) return false;

    const [startH] = item.start_time.split(':').map(Number);
    const [endH] = item.end_time.split(':').map(Number);
    if (hour < startH || hour >= endH) return false;

    if (item.custom_date) {
      return formatDate(item.custom_date) === currentDate;
    }

    return item.day_of_week === day;
  });
};

// 학년 변경
const changeGrade = (g) => {
  selectedGrade.value = g;
  loadData();
};

// 셀 클릭
const cellClick = (day, hour, date) => {
  if (!canEdit.value) return;
  selectedDay.value = day;
  selectedHour.value = hour;
  selectedDate.value = date;
  showModal.value = true;
};

// 등록 후 재로드
const handleCreated = () => {
  showModal.value = false;
  loadData();
};

// 배경색
const getColor = (item) => {
  if (item.schedule_type === '휴강') return '#ff4d4f';
  if (item.schedule_type === '보강') return '#ffe58f';
  if (item.schedule_type === '특강') return '#d9f7be';
  return item.color_code || '#cfe9ff';
};

// 수업명 앞에 태그
const getPrefix = (type) => {
  if (type === '휴강') return '[휴강] ';
  if (type === '보강') return '[보강] ';
  if (type === '특강') return '[특강] ';
  return '';
};

// 데이터 불러오기
const loadData = async () => {
  await store.loadAllTimetables(selectedGrade.value);
  weekRange.value = getWeekRange(selectedWeek.value);
};

onMounted(loadData);
</script>

<style scoped>
.schedule-viewer {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.grade-select {
  margin-bottom: 10px;
}
.grade-select button {
  margin-right: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: #ccc;
  cursor: pointer;
}
.grade-select button.active {
  background: #28a745;
  color: #fff;
}
.week-select {
  margin-bottom: 8px;
}
.week-range {
  font-weight: bold;
  margin-bottom: 12px;
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
}
.schedule-cell {
  border: 1px solid #e0e0e0;
  height: 80px;
  position: relative;
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
