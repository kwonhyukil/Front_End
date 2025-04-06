<template>
  <div class="calendar-event-view">
    <h2>📅 학과 행사 & 공휴일</h2>
    <div class="calendar-layout">
      <div class="event-list">
        <h3>{{ selectedYear }}년 {{ selectedMonth + 1 }}월 일정</h3>
        <ul>
          <li v-for="event in monthlyEvents" :key="event.id" class="event-item">
            <span class="event-date">{{ formatDate(event.start.date || event.start.dateTime) }}</span>
            <span class="event-title">{{ event.summary }}</span>
            <span v-if="event.description" class="event-description">{{ event.description }}</span>
          </li>
        </ul>
      </div>

      <div class="calendar-table">
        <div class="calendar-header">
          <button @click="prevMonth" class="nav-btn">◀</button>
          <strong>{{ selectedYear }}년 {{ selectedMonth + 1 }}월</strong>
          <button @click="nextMonth" class="nav-btn">▶</button>
        </div>
        <table class="calendar-grid">
          <thead>
            <tr>
              <th v-for="day in weekDays" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, i) in calendarData" :key="i">
              <td
                v-for="day in week"
                :key="day.date"
                :class="{
                  'calendar-cell': true,
                  'today': isToday(day.date),
                  'has-event': hasEvents(day.date),
                  'empty': !day.date
                }"
                @click="day.date && goToNoticeFromDate(day.date)"
              >
                {{ day.day }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { fetchHolidayEvents, fetchAdminCalendarEvents } from '../../api/calendar.js'

const today = new Date()
const selectedYear = ref(today.getFullYear())
const selectedMonth = ref(today.getMonth())
const events = ref([])
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

// 월의 시작일과 마지막일 계산
const getStartEndOfMonth = (year, month) => {
  const start = new Date(year, month, 1)
  const end = new Date(year, month + 1, 0)
  return { start, end }
}

// 이벤트 로드
const loadEvents = async () => {
  try {
    const { start, end } = getStartEndOfMonth(selectedYear.value, selectedMonth.value)
    const holidays = await fetchHolidayEvents(start, end)
    const adminEvents = await fetchAdminCalendarEvents(start, end)
    events.value = [...holidays, ...adminEvents]
  } catch (error) {
    console.error('이벤트 로드 오류:', error)
  }
}

// 날짜 포맷팅
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

// 이전 달로 이동
const prevMonth = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11
    selectedYear.value -= 1
  } else {
    selectedMonth.value -= 1
  }
  loadEvents()
}

// 다음 달로 이동
const nextMonth = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0
    selectedYear.value += 1
  } else {
    selectedMonth.value += 1
  }
  loadEvents()
}

// 오늘 날짜 체크
const isToday = (dateStr) => {
  if (!dateStr) return false
  const todayStr = new Date().toISOString().split('T')[0]
  return dateStr === todayStr
}

// 이벤트 존재 여부 체크
const hasEvents = (dateStr) => {
  if (!dateStr) return false
  return events.value.some(e => {
    const eventDate = e.start?.date || e.start?.dateTime?.split('T')[0]
    return eventDate === dateStr
  })
}

// 캘린더 데이터 계산
const calendarData = computed(() => {
  const days = []
  const first = new Date(selectedYear.value, selectedMonth.value, 1)
  const last = new Date(selectedYear.value, selectedMonth.value + 1, 0)
  const startDay = first.getDay()
  const totalDays = last.getDate()

  let current = 1
  for (let i = 0; i < 6; i++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < startDay) || current > totalDays) {
        week.push({ day: '', date: null })
      } else {
        const date = `${selectedYear.value}-${String(selectedMonth.value + 1).padStart(2, '0')}-${String(current).padStart(2, '0')}`
        week.push({ day: current, date })
        current++
      }
    }
    days.push(week)
  }
  return days
})

// 월별 이벤트 필터링
const monthlyEvents = computed(() => {
  return events.value.sort((a, b) => {
    const dateA = new Date(a.start.date || a.start.dateTime)
    const dateB = new Date(b.start.date || b.start.dateTime)
    return dateA - dateB
  })
})

// 공지사항으로 이동
const goToNoticeFromDate = (dateStr) => {
  // TODO: 해당 날짜의 공지사항으로 이동하는 로직 구현
  console.log('날짜 클릭:', dateStr)
}

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.calendar-event-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.calendar-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 20px;
  margin-top: 20px;
}

.event-list {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
}

.event-item {
  margin-bottom: 10px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.event-date {
  font-weight: bold;
  color: #666;
}

.event-title {
  margin-left: 10px;
  color: #333;
}

.event-description {
  display: block;
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.calendar-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  padding: 5px 10px;
  color: #666;
}

.nav-btn:hover {
  color: #333;
}

.calendar-grid {
  width: 100%;
  border-collapse: collapse;
}

.calendar-grid th {
  padding: 10px;
  text-align: center;
  color: #666;
}

.calendar-cell {
  padding: 10px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #eee;
  transition: background-color 0.2s;
}

.calendar-cell:hover {
  background-color: #f5f5f5;
}

.calendar-cell.today {
  background-color: #e3f2fd;
  font-weight: bold;
}

.calendar-cell.has-event {
  color: #1976d2;
  font-weight: bold;
}

.calendar-cell.empty {
  background-color: #f9f9f9;
  cursor: default;
}
</style>
