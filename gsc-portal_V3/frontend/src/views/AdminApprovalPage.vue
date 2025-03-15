<template>
  <div class="admin-container">
    <h2>회원가입 승인</h2>
    <ul>
      <li v-for="user in users" :key="user.email">
        {{ user.name }} ({{ user.email }})
        <button @click="approve(user.email)">승인</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const users = ref([]);

onMounted(async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/pending`);
  users.value = response.data;
});

const approve = async (email) => {
  await axios.post(`${import.meta.env.VITE_API_URL}/admin/approve`, { email });
  users.value = users.value.filter((user) => user.email !== email);
};
</script>
