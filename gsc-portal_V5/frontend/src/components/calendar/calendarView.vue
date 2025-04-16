<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="changeMonth(-1)">〈</button>
      <h2>{{ year }}년 {{ month }}월</h2>
      <button @click="changeMonth(1)">〉</button>
    </div>

    <div class="calendar-weekdays">
      <div v-for="d in weekdays" :key="d" class="weekday">{{ d }}</div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="cell in calendarCells"
        :key="cell.date + cell.day"
        class="calendar-cell"
        @click="$emit('select-date', cell.date)"
      >
        <div class="day-number">{{ cell.day }}</div>
        <div class="dots" v-if="eventsOnDate(cell.date).length">
          <span v-for="(_, i) in eventsOnDate(cell.date)" :key="i" class="dot"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { startOfMonth, getDay, getDaysInMonth, format, addMonths, subMonths } from 'date-fns'

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['month-change', 'select-date'])

/** 달력을 표시할 현재 날짜 상태 */
const currentDate = ref(new Date())

/** 요일 이름 */
const weekdays = ['일', '월', '화', '수', '목', '금', '토']

/** 현재 연도와 월 */
const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth() + 1)

/** 달이 바뀔 때마다 이벤트 데이터를 요청 */
watch(currentDate, () => {
  emit('month-change', year.value, month.value)
}, { immediate: true })

/**
 * 달력 셀(일자) 계산
 * 1) 해당 달의 첫째 날 요일만큼 빈 셀 삽입
 * 2) 일 수만큼 날짜 채우기
 */
const calendarCells = computed(() => {
  const result = []
  const first = startOfMonth(currentDate.value)
  const firstDay = getDay(first)
  const total = getDaysInMonth(currentDate.value)

  // 첫째 날 앞쪽 빈 셀
  for (let i = 0; i < firstDay; i++) {
    result.push({ day: '', date: '' })
  }
  // 해당 달 일 수만큼 채우기
  for (let d = 1; d <= total; d++) {
    const full = format(new Date(year.value, month.value - 1, d), 'yyyy-MM-dd')
    result.push({ day: d, date: full })
  }
  return result
})

/**
 * 특정 날짜에 등록된 이벤트 목록 반환
 */
function eventsOnDate(dateStr) {
  return props.events.filter(e => e.date === dateStr)
}

/**
 * 이전/다음 달로 이동
 */
function changeMonth(offset) {
  currentDate.value = offset > 0
    ? addMonths(currentDate.value, 1)
    : subMonths(currentDate.value, 1)
}
</script>

<style scoped>
.calendar {
  flex: 0.55;
  min-width: 450px;
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.current-month {
  font-size: 1.6rem;
  font-weight: 700;
  color: #333;
}

.month-btn {
  font-size: 1.2rem;
  padding: 0.4rem 1rem;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.month-btn:hover {
  background-color: #f0f0f0;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #666;
}

.weekday {
  padding: 0.5rem 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-cell {
  border: 1px solid #eee;
  min-height: 70px;
  text-align: center;
  position: relative;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s;
}
.calendar-cell:hover {
  background-color: #fafaff;
}

.day-number {
  font-size: 1rem;
  margin-top: 8px;
  color: #333;
}

.no-day {
  color: #ccc;
}

.dots {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 4px;
}

.dot {
  width: 7px;
  height: 7px;
  background-color: #6688ee;
  border-radius: 50%;
}
</style>
