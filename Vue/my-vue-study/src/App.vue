<script setup>

import code1 from './study/API.vue'
import code2 from './study/API2.vue'
import item from './components/ListExample.vue'
import user from './components/UserList.vue'
import index from './components/NumberedList.vue'
import Dynamic from './components/DynamicList.vue'
import Filter from './components/FilteredList.vue'

</script>

<template>
  <!-- 증가 감소 -->
  <code1 /> 

  <!-- 증가 감소 -->
  <code2 />

  <!-- 목록 -->
  <item />

  <!-- 유저 목록 -->
  <user />

  <!-- 인덱스 -->
  <index />
  <!-- 추가 삭제 -->
  <dynamic />

  <!-- 필터링 -->
   <Filter />

   
</template>

