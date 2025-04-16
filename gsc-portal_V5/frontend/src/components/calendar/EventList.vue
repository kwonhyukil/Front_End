<template>
  <div class="event-list">
    <div
      v-for="event in sortedEvents"
      :key="event.id"
      :ref="el => registerRef(event.date, el)"
      class="event-card"
    >
      <div class="date">{{ event.date }}</div>
      <div class="title">{{ event.title }}</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'

/** props & emits 정의 */
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['registerRefs'])

/** 스크롤 이동을 위한 refMap */
const refMap = new Map()

function registerRef(date, el) {
  if (el) {
    // 날짜별로 마지막 요소를 덮어씌울 수도 있으나
    // 여기서는 단일 날짜에 여러 이벤트 시에도 동일 날짜로 스크롤 가능
    refMap.set(date, el)
  }
}

// ✅ 날짜 기준으로 정렬된 이벤트 배열
const sortedEvents = computed(() => {
  return [...props.events].sort((a, b) => new Date(a.date) - new Date(b.date))
})

onMounted(() => {
  /** 부모에 refMap 전달 */
  emit('registerRefs', refMap)
})

</script>

<style scoped>
.event-list {
  flex: 1; /* 좌우 비율 자동 */
  max-height: 60vh;
  overflow-y: auto;
  background: #fff;
  padding: 2rem 1rem;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
}

/* 카드 느낌 강조 */
.event-card {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 6px;
  background-color: #fff;
  border-left: 6px solid #3366cc;
  transition: transform 0.2s;
  cursor: pointer;
}
.event-card:hover {
  transform: translateY(-2px);
  background-color: #f7faff;
}

.date {
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #003399;
}
.title {
  font-size: 1.1rem;
  color: #333;
}


</style>
