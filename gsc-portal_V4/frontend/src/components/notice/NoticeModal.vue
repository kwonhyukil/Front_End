<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <h3>공지사항 작성</h3>

      <!-- 제목 입력 -->
      <label>제목</label>
      <input v-model="title" type="text" />

      <!-- 대상 학년 선택 (드롭다운) -->
      <label>대상 학년</label>
      <select v-model="targetGrade">
        <option value="all">전체</option>
        <option value="1">1학년</option>
        <option value="2">2학년</option>
        <option value="3">3학년</option>
      </select>

      <!-- 중요 공지 여부 체크박스 -->
      <label>중요 공지</label>
      <input type="checkbox" v-model="isImportant" />

      <!-- 첨부파일 업로드 -->
      <label>첨부파일</label>
      <input type="file" multiple @change="handleFileSelect" />

      <!-- 선택된 파일 목록 표시 -->
      <div class="file-list" v-if="fileNames.length > 0">
        <p>첨부된 파일:</p>
        <ul>
          <li v-for="(f, i) in fileNames" :key="i">{{ f }}</li>
        </ul>
      </div>

      <!-- 내용 입력 -->
      <label>내용</label>
      <textarea v-model="content" rows="5"></textarea>

      <!-- 작성/취소 버튼 -->
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
  emits: ["close", "created"], // 부모 컴포넌트에서 모달 닫기와 작성 완료 이벤트를 받음
  setup(props, { emit }) {
    const authStore = useAuthStore(); // 사용자 인증 정보 관리

    // 입력값을 저장할 ref 변수 선언
    const title = ref(""); // 제목
    const targetGrade = ref("all"); // 대상 학년
    const isImportant = ref(false); // 중요 공지 여부
    const content = ref(""); // 내용
    const attachments = ref([]); // 첨부파일 목록
    const fileNames = ref([]); // 첨부파일 이름 목록 (UI 표시용)

    /**
     * 파일 선택 시 실행되는 함수
     * - 선택한 파일들을 `attachments`에 저장
     * - UI에 표시하기 위해 `fileNames` 배열에도 파일 이름 저장
     */
    const handleFileSelect = (e) => {
      attachments.value = e.target.files;
      fileNames.value = Array.from(e.target.files).map(file => file.name);
    };

    /**
     * 공지사항 작성 API 요청 함수
     * - 제목과 내용을 필수 입력값으로 검사
     * - `FormData`를 사용하여 서버에 데이터 전송
     * - 작성 완료 후 부모 컴포넌트에서 목록 새로고침을 위해 `emit("created")` 호출
     */
    const createNewNotice = async () => {
      try {
        if (!title.value || !content.value) {
          alert("제목과 내용을 입력하세요.");
          return;
        }

        // FormData 객체 생성 (multipart/form-data 형식)
        const formData = new FormData();
        formData.append("title", title.value);
        formData.append("content", content.value);
        formData.append("target_grade", targetGrade.value);
        formData.append("is_important", isImportant.value);

        // 첨부파일 추가 (여러 개 가능)
        for (let i = 0; i < attachments.value.length; i++) {
          formData.append("attachments", attachments.value[i]);
        }

        // API 요청: 공지사항 작성
        await createNotice(authStore.token, formData);
        alert("공지사항 작성 완료!");

        emit("created"); // 부모 컴포넌트에서 새 목록을 불러오도록 트리거
      } catch (error) {
        alert("공지사항 작성 실패: " + error.response?.data?.error);
      }
    };

    /**
     * 모달 닫기
     * - 부모 컴포넌트에서 `showModal = false`로 변경하여 모달 숨김
     */
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
/* 모달 배경 오버레이 */
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

/* 모달 컨텐츠 박스 */
.modal-content {
  background: #fff;
  padding: 20px;
  width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
}

/* 첨부파일 리스트 스타일 */
.file-list {
  margin-top: 10px;
  background: #fafafa;
  border: 1px solid #ccc;
  padding: 8px;
}

/* 버튼 그룹 (작성, 취소 버튼) */
.button-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
