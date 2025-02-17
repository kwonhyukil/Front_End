<template>
    <div>
        <h2> 선택한 항목만 출력 </h2>
        <div v-for="item in items" :key="item.id">
            <input type="checkbox" v-model="selectedItems" :value="item.menu" />
            {{ item.menu }}
        </div>
    
        <h3> 선택한 메뉴 </h3>
        <ul>
            <li v-for="selected in selectedItems" :key="selected">
                {{ selected }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
    { id: 1, menu: '김밥'},
    { id: 2, menu: '라면'},
    { id: 3, menu: '돈까스'},
    { id: 4, menu: '제육덥밥'}
])

const selectedItems = ref([])
</script>