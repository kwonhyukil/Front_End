<template>
    <div>
      <h2>공지사항</h2>
      <ul>
        <li v-for="notice in notices" :key="notice.id">
          <strong>{{ notice.title }}</strong> - {{ notice.content }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { fetchNotices } from "../services/noticeService";
  
  const notices = ref([]);
  
  onMounted(async () => {
    notices.value = await fetchNotices();
  });
  </script>
  