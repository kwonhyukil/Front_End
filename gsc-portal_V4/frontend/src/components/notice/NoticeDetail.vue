<template>
  <div class="notice-detail-container">
    <!-- 🔹 공지사항 제목 -->
    <h2>{{ notice.title }}</h2>

    <!-- 🔹 작성 정보 -->
    <div class="info">
      <p>작성일: {{ formatDate(notice.created_at) }} / 조회수: {{ notice.view_count }}</p>
      <p>작성자: {{ notice.author_id }}번 유저 / 대상 학년: {{ notice.target_grade }}</p>
      <p v-if="notice.is_important">❤️ 중요 공지</p>
    </div>

    <!-- 🔹 공지사항 내용 -->
    <div class="content-section">
      <p>{{ notice.content }}</p>
    </div>

    <!-- 🔹 수정/삭제 버튼 (관리자/교수만) -->
    <div v-if="isAdminOrProfessor" class="manage-buttons">
      <button @click="editNotice">수정</button>
      <button @click="deleteCurrentNotice">삭제</button>
    </div>

    <!-- 🔹 목록으로 돌아가기 -->
    <button @click="goBack" class="back-button">목록</button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchNoticeById, deleteNotice } from "../../api/notice.js";
import { useAuthStore } from "../../store/authStore.js";

export default {
  name: "NoticeDetail",
  setup() {
    const route = useRoute(); // 현재 라우트 정보 가져오기
    const router = useRouter(); // 페이지 이동을 위한 Vue Router 사용
    const notice = ref({}); // 공지사항 데이터 저장
    const authStore = useAuthStore(); // 사용자 인증 정보 (Pinia)
    
    // ✅ 관리자(1) 또는 교수(2)만 수정/삭제 가능
    const isAdminOrProfessor = computed(() => authStore.isAdmin || authStore.isProfessor);

    // ✅ 공지사항 상세 불러오기
    const loadDetail = async (id) => {
      try {
        const data = await fetchNoticeById(id);
        notice.value = data;
      } catch (error) {
        console.error("공지사항 불러오기 오류:", error);
      }
    };

    // ✅ 공지사항 삭제 (관리자/교수만 가능)
    const deleteCurrentNotice = async () => {
      if (!confirm("정말 삭제하시겠습니까?")) return;
      try {
        await deleteNotice(authStore.token, notice.value.id);
        alert("삭제 완료");
        router.push("/notice");
      } catch (error) {
        alert("삭제 오류: " + error.response?.data?.error);
      }
    };

    // ✅ 공지사항 수정 (추후 구현 가능)
    const editNotice = () => {
      alert("수정 기능 구현 가능 (모달 or 페이지).");
    };

    // ✅ 목록으로 돌아가기
    const goBack = () => {
      router.push("/notice");
    };

    // ✅ 날짜 형식 변환 함수 (YYYY-MM-DD HH:mm)
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    };

    // ✅ 페이지 로드 시 공지사항 데이터 불러오기
    onMounted(() => {
      const { id } = route.params; // URL에서 id 가져오기
      loadDetail(id);
    });

    return {
      notice,
      isAdminOrProfessor,
      deleteCurrentNotice,
      editNotice,
      goBack,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* 🔹 전체 컨테이너 스타일 */
.notice-detail-container {
  margin: 20px;
}

/* 🔹 공지사항 정보 스타일 */
.info { 
  margin-bottom: 10px; 
}

/* 🔹 공지사항 본문 스타일 */
.content-section {
  border: 1px solid #ddd;
  padding: 10px;
  min-height: 100px;
}

/* 🔹 수정/삭제 버튼 스타일 */
.manage-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

/* 🔹 목록 버튼 스타일 */
.back-button {
  margin-top: 20px;
  padding: 6px 12px;
}
</style>
