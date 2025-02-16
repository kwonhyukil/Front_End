<template>
    <div>
        <h1>과일 목록</h1>
        <ul>
            <li v-for="item in items" :key="item">{{ item }}</li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref(['바나나', '딸기', '메론', '복숭아', '수박', '사과']);

</script>