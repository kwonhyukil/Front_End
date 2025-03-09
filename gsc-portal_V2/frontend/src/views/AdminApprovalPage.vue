<!-- frontend/src/views/AdminApprovalPage.vue -->
<template>
  <div class="admin-container">
    <h2>관리자 승인 페이지</h2>
    <div v-if="pendingUsers.length === 0">현재 대기중인 신청이 없습니다.</div>
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
  const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/admin/pending-users", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  pendingUsers.value = res.data;
};

const approveUser = async (id) => {
  await axios.post(import.meta.env.VITE_BACKEND_URL + "/admin/approve", { id }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  fetchPendingUsers();
};

const rejectUser = async (id) => {
  await axios.post(import.meta.env.VITE_BACKEND_URL + "/admin/reject", { id }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  fetchPendingUsers();
};

onMounted(fetchPendingUsers);
</script>

<style scoped>
.admin-container {
  margin-top: 60px;
  text-align: center;
}
</style>
