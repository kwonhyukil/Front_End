<template>
    <div>
        <h2> 동적으로 리스트 추가 및 삭제 </h2>
        <input v-model="newItem" placeholder="추가할 항목 입력" />
        <button @click="addItem">추가</button>

        <ul>
            <li v-for="(item, index) in items" :key="index">
                {{ item }}
                <button @click="removeItem(index)">삭제</button>
            </li>
        </ul>
    </div>

</template>

<script setup>
import { ref } from 'vue'

const items = ref(['Vue', 'React', 'Augular']);
const newItem = ref('');

// 새로운 항목 추가
const addItem = () => {
    if (newItem.value.trim() != '') {
        items.value.push(newItem.value);
        newItem.value = '';
    }
};

const removeItem = (index) => {
    items.value.splice(index, 1);
}
</script>