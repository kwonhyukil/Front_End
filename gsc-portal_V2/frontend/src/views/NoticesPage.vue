<!-- frontend/src/views/NoticesPage.vue -->
<template>
  <div class="notices-container">
    <h2>📢 공지사항</h2>
    <button v-if="isAdmin" @click="openModal">새 공지 작성</button>

    <ul>
      <li v-for="notice in notices" :key="notice.id" :class="{ important: notice.is_important }">
        <h3>{{ notice.title }}</h3>
        <p>{{ notice.content }}</p>
        <small>기간: {{ formatDate(notice.start_date) }} ~ {{ formatDate(notice.end_date) }}</small>
        <div v-if="isAdmin">
          <button @click="editNotice(notice)">수정</button>
          <button @click="deleteNotice(notice.id)">삭제</button>
        </div>
      </li>
    </ul>

    <!-- 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? "공지 수정" : "공지 작성" }}</h3>
        <input v-model="form.title" placeholder="제목" />
        <textarea v-model="form.content" placeholder="내용"></textarea>
        <label>시작일: <input type="date" v-model="form.start_date" /></label>
        <label>종료일: <input type="date" v-model="form.end_date" /></label>
        <label>중요공지: <input type="checkbox" v-model="form.is_important" /></label>
        <!-- 파일 업로드 구현 시 <input type="file" @change="onFileChange" /> -->
        <button @click="submitNotice">{{ isEditing ? "수정" : "등록" }}</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/authStore";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const isAdmin = computed(() => user.value?.role === "관리자" || user.value?.role === "교수");

const notices = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const form = ref({ title: "", content: "", start_date: "", end_date: "", is_important: false });

const fetchNotices = async () => {
  const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/notices");
  notices.value = res.data.notices;
};

const openModal = () => {
  isEditing.value = false;
  form.value = { title: "", content: "", start_date: "", end_date: "", is_important: false };
  showModal.value = true;
};

const editNotice = (notice) => {
  isEditing.value = true;
  form.value = { ...notice };
  showModal.value = true;
};

const submitNotice = async () => {
  try {
    if (!isAdmin.value) {
      alert("권한이 없습니다.");
      return;
    }
    const url = isEditing.value ? `/notices/${form.value.id}` : "/notices";
    const method = isEditing.value ? "put" : "post";

    await axios[method](import.meta.env.VITE_BACKEND_URL + url, form.value, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    showModal.value = false;
    fetchNotices();
  } catch (error) {
    console.error("공지사항 등록/수정 오류:", error);
  }
};

const deleteNotice = async (id) => {
  if (!isAdmin.value) return alert("권한 없음");
  await axios.delete(import.meta.env.VITE_BACKEND_URL + `/notices/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  fetchNotices();
};

const closeModal = () => {
  showModal.value = false;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString();
};

onMounted(async () => {
  await authStore.fetchUser();
  fetchNotices();
});
</script>

<style scoped>
.notices-container {
  margin: 60px auto;
  max-width: 800px;
}
.important {
  background-color: #fff0f0;
  border-left: 4px solid red;
}
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
}
.modal-content {
  background: #fff;
  width: 400px;
  margin: 100px auto;
  padding: 20px;
}
</style>
