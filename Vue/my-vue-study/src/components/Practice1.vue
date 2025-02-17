<template>

    <div>
        <h2> 김밥 천국 </h2>
        <ul>
            <li v-for="table in filterMenu" :key="table.id">
                {{ table.menu }} - {{ table.price }} 원
            </li>
        </ul>
    </div>


</template>

<script setup>
import { computed, ref } from 'vue'

const tables = ref([
    { id: 1 , menu: '김밥', price: 3500},
    { id: 2 , menu: '라면', price: 4500},
    { id: 3 , menu: '돈까스', price: 7000},
    { id: 4 , menu: '치즈돈까스', price: 7500},
    { id: 5 , menu: '제육덮밥', price: 8000},
    { id: 6 , menu: '김치볶음밥', price: 6500}
])

const filterMenu = computed(() => {
    return tables.value.filter(table => table.menu === '라면')
})
</script>