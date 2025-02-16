<template>
    <div>
        <h2> 사용자 목록</h2>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }} . {{ user.age }} 세
            </li> 
        </ul>
    </div>

</template>

<script setup>
import { ref } from 'vue';

const users = ref([
    { id : 1, name: '홍길동', age: 25},
    { id : 2, name: '김철수', age: 30},
    { id : 3, name: '이영희', age: 22}
])
</script>