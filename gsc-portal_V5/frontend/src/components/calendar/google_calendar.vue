<template>
  <div class="calendar-wrapper">
    <div class="calendar-title">SCHEDULE</div>
    <div class="calendar-layout">
        <EventList :events="events" @registerRefs="saveRefs" />
        <CalendarView :events="events" @month-change="fetchEvents" @select-date="scrollTo" />
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CalendarView from './CalendarView.vue'
import EventList from './EventList.vue'

// ✅ 월별 더미 일정 데이터
const dummyData = {
  "2025-01": [
    { id: 1, title: "세미나", date: "2025-01-26" },
    { id: 2, title: "고객 미팅", date: "2025-01-17" },
    { id: 3, title: "워크숍", date: "2025-01-21" },
    { id: 4, title: "성과 발표", date: "2025-01-27" },
    { id: 5, title: "연구 발표", date: "2025-01-07" },
    { id: 6, title: "이슈 공유", date: "2025-01-13" },
    { id: 7, title: "설명회", date: "2025-01-14" }
  ],
  '2025-04': [
    { id: 1, title: '회의', date: '2025-04-05' },
    { id: 2, title: '발표 준비', date: '2025-04-05' },
    { id: 3, title: '회의 피드백', date: '2025-04-11' },
    { id: 4, title: '클라이언트 미팅', date: '2025-04-18' },
    { id: 5, title: '코드 리뷰', date: '2025-04-18' },
    { id: 6, title: '배포', date: '2025-04-18' },
    { id: 7, title: '세미나', date: '2025-04-25' },
    { "id": 25, "title": "QA 리뷰", "date": "2025-04-09" },
    { "id": 26, "title": "중간 점검", "date": "2025-04-25" },
    { "id": 27, "title": "팀 회식", "date": "2025-04-13" },
    { "id": 28, "title": "이슈 공유", "date": "2025-04-16" },
    { "id": 29, "title": "세미나", "date": "2025-04-14" },
    { "id": 30, "title": "신규 과제 검토", "date": "2025-04-25" },
    { "id": 31, "title": "QA 리뷰", "date": "2025-04-07" },
    { "id": 32, "title": "배포", "date": "2025-04-21" },
    { "id": 33, "title": "기획 회의", "date": "2025-04-09" },
    { "id": 34, "title": "기획 회의", "date": "2025-04-15" },
    { "id": 35, "title": "고객 미팅", "date": "2025-04-21" },
    { "id": 36, "title": "중간 점검", "date": "2025-04-15" }
  ],
  '2025-05': [
    { id: 8, title: '5월 회의', date: '2025-05-02' },
    { id: 9, title: '워크숍', date: '2025-05-10' },
    { id: 10, title: '데모데이', date: '2025-05-16' },
    { id: 11, title: '성과 공유', date: '2025-05-23' }
  ],
  '2025-06': [
    { id: 12, title: '6월 킥오프', date: '2025-06-03' },
    { id: 13, title: '중간 점검', date: '2025-06-15' },
    { id: 14, title: 'QA 리뷰', date: '2025-06-21' },
    { id: 15, title: '마감', date: '2025-06-30' }
  ]
}

const events = ref([])
const refMap = ref(new Map())

/**
 * 월 변경 시 해당 월의 데이터 불러오기
 */
async function fetchEvents(year, month) {
  const key = `${year}-${String(month).padStart(2, '0')}`
  events.value = dummyData[key] || []
}

/**
 * EventList에서 받아온 Ref 맵 저장
 */
function saveRefs(map) {
  refMap.value = map
}

function scrollTo(date) {
  const el = refMap.value.get(date)
  const container = document.querySelector('.event-list')

  if (el && container) {
    const containerTop = container.getBoundingClientRect().top
    const elementTop = el.getBoundingClientRect().top

    const targetScroll =
      container.scrollTop + (elementTop - containerTop) - container.clientHeight / 2 + el.clientHeight / 2

    // ⏳ 천천히 이동 - 애니메이션
    smoothScrollTo(container, targetScroll, 1200) // 800ms 동안 이동

    // ✨ 하이라이트 효과
    el.classList.add('highlight')
    setTimeout(() => el.classList.remove('highlight'), 1500)
  }
}

// 🔁 스크롤 애니메이션 함수
function smoothScrollTo(container, target, duration) {
  const start = container.scrollTop
  const distance = target - start
  const startTime = performance.now()

  function step(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const ease = easeInOutCubic(progress)

    container.scrollTop = start + distance * ease

    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }

  requestAnimationFrame(step)
}

// 🎚️ 가속도 보간 함수 (느리게 시작 → 빠르게 → 천천히 멈춤)
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}


</script>


<style scoped>
.calendar-wrapper {
  width: 100%;
  padding: 3rem 4rem;
  box-sizing: border-box;
}

.calendar-title {
  font-size: 2.4rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3rem;
  color: #434a56;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
}

.calendar-layout {
  display: flex;
  width: 100%;
  gap: 3rem;
  align-items: flex-start;
  background: #f4f6fc;
}
</style>
