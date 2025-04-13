<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content notice-modal">
      <h3>{{ isEditMode ? '공지 수정' : '공지 등록' }}</h3>

      <!-- 제목 -->
      <label>제목</label>
      <input v-model="title" placeholder="공지 제목 입력" />

      <!-- 내용 -->
      <label>내용</label>
      <textarea v-model="content" placeholder="공지 내용을 입력하세요" />

      <!-- 담당 교수 -->
      <label>담당 교수</label>
      <select v-model="professorId">
        <option disabled value="">교수를 선택하세요</option>
        <option v-for="p in professors" :key="p.id" :value="p.id">
          {{ p.name }}
        </option>
      </select>

      <!-- 📅 공지 날짜 선택 -->
      <label>공지 날짜</label>
      <input type="date" v-model="eventDate" />

      <!-- ✅ 학과 행사 등록 여부 -->
      <label>
        <input type="checkbox" v-model="isDepartmentEvent" /> 학과 행사로 등록
      </label>

      <!-- 버튼 -->
      <div class="button-group">
        <button @click="submitForm">{{ isEditMode ? '수정' : '등록' }}</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';

const props = defineProps(['noticeToEdit']);
const emit = defineEmits(['close', 'submitted']);

const title = ref('');
const content = ref('');
const professorId = ref('');
const professors = ref([]);
const eventDate = ref('');
const isDepartmentEvent = ref(false);

const auth = useAuthStore();
const isEditMode = computed(() => !!props.noticeToEdit);

onMounted(async () => {
  if (isEditMode.value) {
    title.value = props.noticeToEdit.title;
    content.value = props.noticeToEdit.content;
    professorId.value = props.noticeToEdit.professor_id;
    eventDate.value = props.noticeToEdit.event_date || '';
    isDepartmentEvent.value = props.noticeToEdit.is_department_event || false;
  }

  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/professors`);
    professors.value = res.data;
  } catch (err) {
    console.error('❌ 교수 목록 로딩 실패', err);
    alert('교수 목록을 불러오는 데 실패했습니다.');
  }
});

const submitForm = async () => {
  if (!title.value || !content.value || !professorId.value) {
    alert('모든 항목을 입력해주세요.');
    return;
  }

  const payload = {
    title: title.value,
    content: content.value,
    professor_id: Number(professorId.value),
    event_date: eventDate.value || null,
    is_department_event: isDepartmentEvent.value,
  };

  try {
    const url = isEditMode.value
      ? `${import.meta.env.VITE_API_URL}/notice/${props.noticeToEdit.id}`
      : `${import.meta.env.VITE_API_URL}/notice`;

    const method = isEditMode.value ? 'put' : 'post';

    await axios[method](url, payload, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    alert(isEditMode.value ? '공지사항 수정 완료' : '공지사항 등록 완료');
    emit('submitted');
  } catch (err) {
    console.error('❌ 공지사항 저장 실패', err);
    alert('공지사항 저장 중 오류가 발생했습니다.');
  }
};

const closeModal = () => emit('close');
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content.notice-modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.notice-modal label {
  display: block;
  margin-top: 8px;
  font-weight: bold;
}

.notice-modal input,
.notice-modal textarea,
.notice-modal select {
  width: 100%;
  margin-bottom: 6px;
  padding: 6px;
  box-sizing: border-box;
}

.notice-modal textarea {
  min-height: 100px;
}

.button-group {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
</style>
