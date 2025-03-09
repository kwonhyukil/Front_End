<template>
  <div class="notices-container">
    <h2>📢 공지사항</h2>
    <button v-if="isAdmin" @click="openCreateModal">📌 새 공지 작성</button>
    
    <ul>
      <li v-for="notice in notices" :key="notice.id">
        <h3>{{ notice.title }}</h3>
        <p>{{ notice.content }}</p>
        <small>작성일: {{ formatDate(notice.created_at) }}</small>
        
        <div v-if="isAdmin">
          <button @click="editNotice(notice)">✏️ 수정</button>
          <button @click="deleteNotice(notice.id)">🗑 삭제</button>
        </div>
      </li>
    </ul>

    <Modal v-if="isModalOpen" @close="closeModal">
      <h3>{{ isEditing ? "공지 수정" : "새 공지 작성" }}</h3>
      <input v-model="form.title" placeholder="제목" />
      <textarea v-model="form.content" placeholder="내용"></textarea>
      <button @click="submitNotice">저장</button>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

const notices = ref([]);
const isModalOpen = ref(false);
const isEditing = ref(false);
const form = ref({ title: "", content: "" });
const user = ref(null); // 사용자 정보 저장

const fetchNotices = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/notices");
    notices.value = response.data.notices;
  } catch (error) {
    console.error("❌ 공지사항 불러오기 오류:", error);
  }
};

const deleteNotice = async (id) => {
  try {
    await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/notices/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchNotices();
  } catch (error) {
    console.error("❌ 공지사항 삭제 오류:", error);
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  form.value = { title: "", content: "" };
  isModalOpen.value = true;
};

const editNotice = (notice) => {
  isEditing.value = true;
  form.value = { ...notice };
  isModalOpen.value = true;
};

const submitNotice = async () => {
  try {
    const url = isEditing.value
      ? `/api/notices/${form.value.id}`
      : "/api/notices";
    const method = isEditing.value ? "put" : "post";

    await axios[method](import.meta.env.VITE_BACKEND_URL + url, form.value, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    isModalOpen.value = false;
    fetchNotices();
  } catch (error) {
    console.error("❌ 공지사항 저장 오류:", error);
  }
};

const closeModal = () => {
  isModalOpen.value = false;
};

const isAdmin = computed(() => user.value?.role === "관리자" || user.value?.role === "교수");

const formatDate = (date) => new Date(date).toLocaleString();

onMounted(() => {
  fetchNotices();
});
</script>

<style scoped>
.notices-container { padding: 20px; }
h2 { margin-bottom: 10px; }
ul { list-style: none; padding: 0; }
li { padding: 10px; border-bottom: 1px solid #ccc; }
button { margin: 5px; }
</style>
