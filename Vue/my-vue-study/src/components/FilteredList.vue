<template>
  <div>
    <h2>✅ 특정 나이 이상만 표시 (computed 사용)</h2>
    <ul>
      <li v-for="user in filteredUsers" :key="user.id">
        {{ user.name }} - {{ user.age }}세
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const users = ref([
  { id: 1, name: '홍길동', age: 25 },
  { id: 2, name: '김철수', age: 20 },
  { id: 3, name: '이영희', age: 30 }
]);

// ✅ computed 속성을 사용하여 필터링
const filteredUsers = computed(() => {
  return users.value.filter(user => user.age >= 25);
});
</script>