<script setup>
import { useDataStore } from '../store/data';

const store = useDataStore();
</script>

<template>
  <div class="container">
    <h1>📊 현재 현황</h1>

    <div class="status-card">
      <h2>🔢 To-do-list</h2>
      <p>오늘의 목표: <span class="count">{{ store.count }} 개</span></p>
    </div>

    <div class="task-list">
      <h2>📋 List</h2>
      <ul>
        <li v-for="(subject, index) in store.subjects" :key="index" :class="{ completed: subject.checked }">
          <span>{{ subject.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>


<style>

/* ✅ 체크된 항목 스타일 */
.completed {
  text-decoration: line-through;
  color: #999;
  background: #e9ecef;
}

/* ✅ 전체 레이아웃 */
.container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
}

/* ✅ 제목 스타일 */
h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
}

/* ✅ 상태 카드 (할 일 개수) */
.status-card {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 18px;
}

.count {
  font-weight: bold;
  color: #007bff;
}

/* ✅ 체크리스트 스타일 */
.task-list {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
}

/* ✅ 리스트 스타일 */
ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

li {
  padding: 10px;
  font-size: 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

/* ✅ 체크된 항목 스타일 */
.completed {
  text-decoration: line-through;
  color: #999;
  font-style: italic;
  background: #e9ecef;
}
</style>
