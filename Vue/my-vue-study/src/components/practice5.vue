<template>
    <div>
        <h2> 드롭다운에서 선택한 메뉴 출력 </h2>
        <select v-model="selectedMenu">
            <opiton disabled value=""> 메뉴를 선택하세요 </opiton>
            <option v-for="menu in menuList" :key="menu.id" :value="menu.menu">
                {{ menu.menu }}
            </option>
        </select>

        <button @click="addMenu">추가</button>

        <p v-for="(select, index) in selectedList" :key="index">
            선택한 메뉴: {{ index + 1 }} . {{  select }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedList = ref ([])

const menuList = ref([
    { id: 0, menu: '선택'},
    { id: 1, menu: '김밥'},
    { id: 2, menu: '김치볶음밥'},
    { id: 3, menu: '돈까스'},
    { id: 4, menu: '제육덮밥'},
    { id: 5, menu: '치즈돈까스'},
    { id: 6, menu: '돌솥비빔밥'}
])

const selectedMenu = ref('')

const addMenu = () => {
    if (selectedMenu.value && selectedMenu.value.trim() !== '') {
        selectedList.value.push(selectedMenu.value)
        selectedMenu.value = ''
    }
    
}

</script>