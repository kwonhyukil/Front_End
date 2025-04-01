<!-- 컴포지션 API -->
<script setup>
import { ref, onMounted } from 'vue'

// 반응적인 상태의 속성
const count = ref(0)

// 속성 값을 변경하고 업데이트 할 수 있는 함수.
function increment () {
    count.value++
}
function decreased () {
    count.value--
}

// 생명 주기 훅
onMounted(() => {
    console.log('숫자 세기의 초기값은 ${ count.value } 입니다.')
})
</script>

<template>
    <h1>{{ count }}</h1>
    <button @click="increment">증가</button>
    <button @click="decreased">감소</button>
</template>