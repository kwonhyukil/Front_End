<template>
  <div>
    <h2>사용자 목록</h2>
    <form @submit.prevent="submitUser">
      <input v-model="name" placeholder="이름 입력" required />
      <input v-model="email" type="email" placeholder="이메일 입력" required />
      <button type="submit">추가</button>
    </form>

    <ul>
      <li v-for="user in users" :key="user.id">
        <strong>{{ user.name }}</strong> - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { fetchUsers, addUser } from "../services/userService";

const users = ref([]);
const name = ref("");
const email = ref("");

const loadUsers = async () => {
  users.value = await fetchUsers();
};

const submitUser = async () => {
  if (!name.value || !email.value) return;
  await addUser(name.value, email.value);
  name.value = "";
  email.value = "";
  loadUsers();
};

onMounted(loadUsers);
</script>
