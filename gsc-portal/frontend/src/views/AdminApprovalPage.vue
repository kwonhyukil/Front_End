<template>
    <div class="admin-container">
      <h2>관리자 승인 페이지</h2>
      <ul>
        <li v-for="user in pendingUsers" :key="user.id">
          {{ user.name }} ({{ user.email }})
          <button @click="approveUser(user.id)">승인</button>
          <button @click="rejectUser(user.id)">거절</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const pendingUsers = ref([]);
  
  const fetchPendingUsers = async () => {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/auth/pending-users");
    pendingUsers.value = response.data;
  };
  
  const approveUser = async (id) => {
    await axios.post(import.meta.env.VITE_BACKEND_URL + "/auth/approve", { id });
    fetchPendingUsers();
  };
  
  const rejectUser = async (id) => {
    await axios.post(import.meta.env.VITE_BACKEND_URL + "/auth/reject", { id });
    fetchPendingUsers();
  };
  
  onMounted(fetchPendingUsers);
  </script>
  