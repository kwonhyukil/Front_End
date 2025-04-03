<template>
  <div class="schedule-viewer container">
    <h2>학년별 시간표</h2>

    <!-- ✅ 학년 선택 -->
    <div class="grade-select">
      <button :class="{active: selectedGrade === '1'}" @click="changeGrade('1')">1학년</button>
      <button :class="{active: selectedGrade === '2'}" @click="changeGrade('2')">2학년</button>
      <button :class="{active: selectedGrade === '3'}" @click="changeGrade('3')">3학년</button>
    </div>

    <!-- ✅ 주차 선택 -->
    <div class="week-select">
      <label>주차 선택:</label>
      <select v-model="selectedWeek" @change="loadData">
        <option v-for="week in 16" :key="week" :value="week">{{ week }}주차</option>
      </select>
    </div>

    <!-- ✅ 날짜 범위 -->
    <div class="week-range">
      <p>{{ selectedWeek }}주차 ({{ weekRange.start }} ~ {{ weekRange.end }})</p>
    </div>

    <!-- ✅ 시간표 테이블 -->
    <div class="timetable">
      <table class="time-table">
        <thead>
          <tr>
            <th class="time-col">교시 / 시간</th>
            <th v-for="d in weekRange.dates" :key="d.day">
              {{ d.day }}<br>{{ d.date }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="hour in hours" :key="hour">
            <td class="hour-cell">{{ hour }}:00 ~ {{ hour + 1 }}:00</td>
            <td
              v-for="d in weekRange.dates"
              :key="d.day"
              class="schedule-cell"
              @click="cellClick(d.day, hour)"
              @mouseenter="onCellEnter(d.day, hour, $event)"
              @mouseleave="onCellLeave"
            >
              <div
                v-for="(item, i) in getClasses(d.day, hour, d.date)"
                :key="i"
                class="class-box"
                :style="{ backgroundColor: item.color_code || '#cfe9ff' }"
              >
                <strong>{{ item.course_name }}</strong><br />
                {{ item.room }} / {{ item.professor_name }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 등록 / 수정 모달 -->
    <TimetableModal
      v-if="showModal && canEdit"
      :day="selectedDay"
      :hour="selectedHour"
      :grade="selectedGrade"
      :scheduleToEdit="scheduleToEdit"
      @close="onModalClose"
      @created="handleCreated"
    />


    <!-- ✅ 툴팁 -->
    <div
      v-if="tooltip.visible"
      class="tooltip-box"
      :style="{ top: tooltip.top + 'px', left: tooltip.left + 'px' }"
      @mouseenter="cancelTooltipHide"
      @mouseleave="hideTooltipWithDelay"
    >
      <div v-for="cls in tooltip.classes" :key="cls.id" class="tooltip-class">
        <strong>{{ cls.course_name }}</strong><br />
        교수: {{ cls.professor_name }}<br />
        시간: {{ cls.start_time }} ~ {{ cls.end_time }}<br />
        교실: {{ cls.room }}<br />
        유형: {{ cls.schedule_type }}
        <div class="tooltip-actions">
          <button @click="editClass(cls)">수정</button>
          <button @click="deleteClass(cls.id)">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTimetableStore } from '../../store/timetableStore';
import { useAuthStore } from '../../store/authStore';
import TimetableModal from './TimetableModal.vue';

const store = useTimetableStore();
const auth = useAuthStore();

const selectedGrade = ref('1');
const selectedWeek = ref(1);
const selectedDay = ref('월');
const selectedHour = ref(9);
const showModal = ref(false);
const scheduleToEdit = ref(null);

const canEdit = computed(() => auth.isAdmin || auth.isProfessor);
const days = ['월','화','수','목','금','토'];
const hours = [9,10,11,12,13,14,15,16,17,18];
const semesterStart = new Date('2025-03-03');

// ✅ 주차 계산
const getWeekRange = (week) => {
  const start = new Date(semesterStart);
  start.setDate(start.getDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 5);
  const format = (d) => d.toISOString().split('T')[0];
  return {
    start: format(start),
    end: format(end),
    dates: Array.from({ length: 6 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        day: days[i],
        date: format(date)
      };
    })
  };
};
const weekRange = ref(getWeekRange(selectedWeek.value));

// ✅ 시간표 필터
const getClasses = (day, hour, date) => {
  return store.timetables.filter(item => {
    if (Number(item.grade_id) !== Number(selectedGrade.value)) return false;
    const [sh] = item.start_time.split(':').map(Number);
    const [eh] = item.end_time.split(':').map(Number);
    const inHour = hour >= sh && hour < eh;

    if (item.custom_date) {
      return new Date(item.custom_date).toISOString().split('T')[0] === date && inHour;
    } else {
      return item.day_of_week === day && inHour;
    }
  });
};

// ✅ 툴팁
const tooltip = ref({ visible: false, classes: [], top: 0, left: 0 });
let hideTimeout = 2000;

const onCellEnter = (day, hour, event) => {
  const date = weekRange.value.dates.find(d => d.day === day)?.date;
  const classes = getClasses(day, hour, date);
  if (classes.length === 0) return;
  if (hideTimeout) clearTimeout(hideTimeout);

  const rect = event.currentTarget.getBoundingClientRect();
  tooltip.value = {
    visible: true,
    classes,
    top: rect.top + window.scrollY,
    left: rect.right
  };
};

const onCellLeave = () => {
  hideTimeout = setTimeout(() => {
    tooltip.value.visible = false;
  }, 1500);
};
const cancelTooltipHide = () => {
  if (hideTimeout) clearTimeout(hideTimeout);
};
const hideTooltipWithDelay = () => {
  hideTimeout = setTimeout(() => {
    tooltip.value.visible = false;
  }, 1500);
};

// ✅ 등록/수정 모달 핸들러
const cellClick = (day, hour) => {
  if (!canEdit.value) return;
  selectedDay.value = day;
  selectedHour.value = hour;
  scheduleToEdit.value = null; // 등록 모드
  showModal.value = true;
};
const editClass = (cls) => {
  scheduleToEdit.value = { ...cls };
  selectedDay.value = cls.day_of_week;
  selectedHour.value = parseInt(cls.start_time.split(':')[0]);
  showModal.value = true;
};
const deleteClass = async (id) => {
  try {
    await store.deleteTimetable(auth.token, id);
    loadData();
  } catch (e) {
    alert('삭제 실패: ' + e.message);
  }
};
const onModalClose = () => {
  showModal.value = false;
  scheduleToEdit.value = null;
};
const handleCreated = () => {
  showModal.value = false;
  scheduleToEdit.value = null;
  loadData();
};
const changeGrade = (g) => {
  selectedGrade.value = g;
  loadData();
};
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
  font-family: 'Arial', sans-serif;
}

/* 학년 선택 */
.grade-select {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.grade-select button {
  margin: 0 10px;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: #e0e0e0;
  cursor: pointer;
  font-size: 14px;
}
.grade-select button.active {
  background: #007bff;
  color: white;
}

/* 주차 선택 */
.week-select {
  text-align: center;
  margin-bottom: 10px;
}
.week-select label {
  font-size: 14px;
  margin-right: 8px;
}
.week-select select {
  padding: 4px 8px;
  font-size: 14px;
}

/* 주차 정보 */
.week-range {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 16px;
}

/* 시간표 테이블 */
.time-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.time-col {
  width: 120px;
  background: #f1f1f1;
  text-align: center;
  font-weight: bold;
  padding: 10px 0;
}
.hour-cell {
  text-align: center;
  border: 1px solid #e0e0e0;
  background: #fafafa;
  padding: 10px 0;
}
.schedule-cell {
  border: 1px solid #e0e0e0;
  height: 90px;
  overflow-y: auto;
  vertical-align: top;
  position: relative;
  padding: 4px;
  cursor: pointer;
}
.schedule-cell:hover {
  background: #f4faff;
}

/* 수업 박스 */
.class-box {
  max-height: 100%;
  overflow: hidden;
  padding: 2px 4px;
  margin: 2px 0;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
  color: #333;
}

/* 🟦 일반 수업 */
.일반 {
  background-color: #cfe9ff;
}

/* ⚪ 휴강 */
.휴강 {
  background-color: #dddddd;
  text-decoration: line-through; /* 휴강은 취소선도 가능 */
}

/* 🟩 보강 */
.보강 {
  background-color: #b4f0b4;
}

/* 🟪 특강 */
.특강 {
  background-color: #e0c6ff;
}

/* 툴팁 */
.tooltip-box {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
  width: 260px;
  font-size: 14px;
}
.tooltip-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.tooltip-actions button {
  padding: 6px 12px;
  border: none;
  background: #eee;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.tooltip-actions button:hover {
  background: #ddd;
}
</style>