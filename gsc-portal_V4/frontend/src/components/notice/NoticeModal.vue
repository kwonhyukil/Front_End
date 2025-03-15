<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>공지사항 작성</h3>
      <label>제목</label>
      <input v-model="title" type="text" />

      <label>대상 학년</label>
      <select v-model="targetGrade">
        <option value="all">전체</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>

      <label>중요 공지</label>
      <input type="checkbox" v-model="isImportant" />

      <label>첨부파일</label>
      <input type="file" multiple @change="handleFileSelect" />

      <div class="file-list" v-if="fileNames.length > 0">
        <p>첨부된 파일:</p>
        <ul>
          <li v-for="(f,i) in fileNames" :key="i">{{ f }}</li>
        </ul>
      </div>

      <label>내용</label>
      <textarea v-model="content" rows="5"></textarea>

      <div class="button-group">
        <button @click="createNewNotice">작성하기</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { createNotice } from "../../api/notice.js";

export default {
  name: "NoticeModal",
  emits: ["close","created"],
  setup(props, { emit }) {
    const authStore = useAuthStore();

    // 폼 데이터
    const title = ref("");
    const targetGrade = ref("all");
    const isImportant = ref(false);
    const content = ref("");
    const attachments = ref([]);
    const fileNames = ref([]);

    // 파일 선택 핸들러
    const handleFileSelect = (e) => {
      attachments.value = e.target.files;
      fileNames.value = Array.from(e.target.files).map(file => file.name);
    };

    const createNewNotice = async () => {
      try {
        if (!title.value || !content.value) {
          alert("제목과 내용을 입력하세요.");
          return;
        }
        // FormData 구성
        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("content", content.value);
        formData.append("target_grade", targetGrade.value);
        formData.append("is_important", isImportant.value);

        // 첨부파일
        for (let i=0; i<attachments.value.length; i++) {
          formData.append("attachments", attachments.value[i]);
        }

        await createNotice(authStore.token, formData);
        alert("공지사항 작성 완료!");
        emit("created");
      } catch (error) {
        alert("공지사항 작성 실패: " + error.response?.data?.error);
      }
    };

    const closeModal = () => {
      emit("close");
    };

    return {
      title,
      targetGrade,
      isImportant,
      content,
      attachments,
      fileNames,
      handleFileSelect,
      createNewNotice,
      closeModal,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.modal-content {
  background: #fff;
  padding: 20px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
}
.file-list {
  margin-top: 10px;
  background: #fafafa;
  border: 1px solid #ccc;
  padding: 8px;
}
.button-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
