<template>
    <div>
      <h1>🎉 대시보드</h1>
      <p>안녕하세요, {{ user.name }}님</p>
      <img :src="user.picture" width="100" />
    </div>
  </template>
  
  <script setup>
  import { useUserStore } from '../stores/useUserStore'
  
  const user = useUserStore()
  </script>
  