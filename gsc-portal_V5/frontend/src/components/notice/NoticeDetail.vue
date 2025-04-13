<template>
  <div class="notice-detail-container">
    <h2>{{ notice.title }}</h2>
    <div class="info">
      <p>작성일: {{ formatDate(notice.created_at) }} / 조회수: {{ notice.view_count }}</p>
      <p>작성자: {{ notice.author_id }}번 유저 / 대상 학년: {{ notice.target_grade }}</p>
      <p v-if="notice.is_important">❤️ 중요 공지</p>
    </div>
    <div class="content-section">
      <p>{{ notice.content }}</p>
    </div>
    <button v-if="isAdminOrProfessor" @click="openEditModal">수정</button>
    <button v-if="isAdminOrProfessor" @click="deleteNotice">삭제</button>

    <!-- 수정 모달 -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-content">
        <h3>공지사항 수정</h3>
        <label>제목</label>
        <input v-model="editTitle" />
        <label>내용</label>
        <textarea v-model="editContent"></textarea>
        <label>대상 학년</label>
        <select v-model="editTargetGrade">
          <option value="all">전체</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
        <label>중요 공지</label>
        <input type="checkbox" v-model="editImportant" />
        <button @click="submitEdit">수정 완료</button>
        <button @click="closeEditModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchNoticeById, deleteNotice, updateNotice, downloadAttachmentRequest } from "../../api/notice.js";
import { useAuthStore } from "../../store/authStore.js";

export default {
  name: "NoticeDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const noticeId = route.params.id;
    const authStore = useAuthStore();
    const isAdminOrProfessor = computed(() => authStore.isAdmin || authStore.isProfessor);

    const notice = ref({});
    const attachments = ref([]);
    const showEditModal = ref(false);

    const editTitle = ref("");
    const editContent = ref("");
    const editTargetGrade = ref("all");
    const editImportant = ref(false);

    const formatDate = (dateString) => {
      if (!dateString) return "날짜 없음";
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const loadData = async () => {
      const data = await fetchNoticeById(noticeId);
      notice.value = data.notice;
      attachments.value = data.attachments;
    };

    onMounted(() => {
      loadData();
    });

    const openEditModal = () => {
      showEditModal.value = true;
      editTitle.value = notice.value.title;
      editContent.value = notice.value.content;
      editTargetGrade.value = notice.value.target_grade;
      editImportant.value = notice.value.is_important;
    };
    const closeEditModal = () => {
      showEditModal.value = false;
    };

    const submitEdit = async () => {
      try {
        const payload = {
          title: editTitle.value,
          content: editContent.value,
          target_grade: editTargetGrade.value,
          is_important: editImportant.value,
        };
        await updateNotice(authStore.token, notice.value.id, payload);
        alert("수정 완료!");
        closeEditModal();
        loadData();
      } catch (error) {
        alert("수정 오류: " + error.response?.data?.error);
      }
    };

    const deleteNoticeFn = async () => {
      if (!confirm("삭제하시겠습니까?")) return;
      await deleteNotice(authStore.token, notice.value.id);
      alert("삭제 완료");
      router.push("/notice");
    };

    const downloadFile = async (attachmentId) => {
      const res = await downloadAttachmentRequest(authStore.token, attachmentId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "attachment");
      document.body.appendChild(link);
      link.click();
    };

    return {
      notice,
      attachments,
      showEditModal,
      editTitle, editContent, editTargetGrade, editImportant,
      isAdminOrProfessor,
      openEditModal,
      closeEditModal,
      formatDate,
      submitEdit,
      deleteNotice: deleteNoticeFn,
      downloadFile,
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
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-content {
  background: #fff;
  padding: 20px;
  width: 400px;
  border-radius: 6px;
}
</style>
