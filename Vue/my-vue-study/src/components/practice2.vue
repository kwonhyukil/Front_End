<template>
    
    <div>
        <h2> 테이블 형태의 메뉴 리스트 </h2>
        <table border="1">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>메뉴</th>
                    <th>가격</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in menuList" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.menu }}</td>
                    <td>{{ item.price }}원</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const menuList = ref([
    { id: 1, menu: '김밥', price: 3500},
    { id: 2, menu: '라면', price: 4500},
    { id: 3, menu: '돈까스', price: 7500},
    { id: 4, menu: '제육덮밥', price: 8000},
    { id: 5, menu: '라볶이', price: 6000},
    { id: 6, menu: '돌솥비빔밥', price: 6500}
]);
</script>
