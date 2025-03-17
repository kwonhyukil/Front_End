<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>📢 공지사항 작성</h3>

      <!-- 제목 및 중요 공지 체크 -->
      <div class="form-group">
        <label class="form-title">제목</label>
        <div class="title-box">
          <input v-model="title" type="text" class="input-field" placeholder="제목을 입력하세요" />
          <label class="important-label">
            <input type="checkbox" v-model="isImportant" />
            ⚠️ 중요
          </label>
        </div>
      </div>

      <!-- 대상 학년 선택 -->
      <div class="form-group">
        <label class="form-title">대상 학년</label>
        <div class="grade-select">
          <button v-for="grade in grades" :key="grade.value"
                  :class="['grade-btn', { active: targetGrade === grade.value }]"
                  @click="targetGrade = grade.value">
            {{ grade.label }}
          </button>
        </div>
      </div>

      <!-- 첨부파일 업로드 -->
      <div class="form-group">
        <label class="form-title">📎 첨부파일</label>
        <input type="file" multiple @change="handleFileSelect" class="file-input" />
        <div class="file-list" v-if="fileNames.length > 0">
          <p>📂 첨부된 파일:</p>
          <ul>
            <li v-for="(f, i) in fileNames" :key="i">📄 {{ f }}</li>
          </ul>
        </div>
      </div>

      <!-- 내용 입력 -->
      <div class="form-group">
        <label class="form-title">내용</label>
        <textarea v-model="content" rows="5" class="textarea-field" placeholder="내용을 입력하세요"></textarea>
      </div>

      <!-- 버튼 그룹 -->
      <div class="button-group">
        <button class="btn-cancel" @click="closeModal">❌ 취소</button>
        <button class="btn-submit" @click="createNewNotice">📝 작성하기</button>
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
  emits: ["close", "created"],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const title = ref("");
    const targetGrade = ref("all");
    const isImportant = ref(false);
    const content = ref("");
    const attachments = ref([]);
    const fileNames = ref([]);

    const grades = [
      { value: "all", label: "전체" },
      { value: "1", label: "1학년" },
      { value: "2", label: "2학년" },
      { value: "3", label: "3학년" },
    ];

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

        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("content", content.value);
        formData.append("target_grade", targetGrade.value);
        formData.append("is_important", isImportant.value);

        for (let i = 0; i < attachments.value.length; i++) {
          formData.append("attachments", attachments.value[i]);
        }

        await createNotice(authStore.token, formData);
        alert("공지사항 작성 완료!");
        emit("created");
        closeModal();
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
      grades,
      handleFileSelect,
      createNewNotice,
      closeModal,
    };
  },
};
</script>

<style scoped>
/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

/* 모달 내용 */
.modal-content {
  background: #fff;
  padding: 20px;
  width: 480px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* 폼 그룹 */
.form-group {
  margin-bottom: 15px;
}

.form-title {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.title-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-field, .textarea-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.textarea-field {
  height: 100px;
}

/* 중요 공지 체크박스 */
.important-label {
  display: flex;
  align-items: center;
  font-weight: bold;
}

/* 대상 학년 선택 */
.grade-select {
  display: flex;
  gap: 10px;
}

.grade-btn {
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  background: #f0f0f0;
}

.grade-btn.active {
  background: #ffc107;
  color: white;
}

/* 파일 리스트 */
.file-list {
  margin-top: 10px;
  padding: 8px;
  background: #f8f8f8;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* 버튼 스타일 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn-submit {
  background: #ffc107;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel {
  background: #ccc;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
