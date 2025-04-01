<template>
    <div>
        <input v-model="newItem" placeholder="추가할 메뉴 입력" />
        <button @click="addItem">추가!</button>

        <ul>
            <li v-for="(item, index) in items" :key="index">
                {{ index + 1}} . {{ item }}
                <button @click="removeItem(index)">삭제!</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const items = ref(['김밥', '제육덮밥', '돌솥비빔밥', '돈까스', '라면', '라볶이', '잔치국수'])
const newItem = ref('')

// 새로운 항목 추가
const addItem = () => {
    if (newItem.value.trim() !== '') {
        items.value.push(newItem.value);
        newItem.value = ''; // 입력 필드 초기화
    }
};

// 항목 삭제
const removeItem = (index) => {
    items.value.splice(index, 1)
};
</script>