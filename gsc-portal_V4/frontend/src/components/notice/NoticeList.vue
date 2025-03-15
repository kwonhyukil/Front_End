<template>
  <div class="notice-list-container">
    <h2>공지사항</h2>

    <!-- 학년 필터 탭 -->
    <div class="grade-tabs">
      <button
        :class="{ active: selectedGrade === 'all' }"
        @click="selectGrade('all')"
      >전체</button>
      <button
        :class="{ active: selectedGrade === '1' }"
        @click="selectGrade('1')"
      >1학년</button>
      <button
        :class="{ active: selectedGrade === '2' }"
        @click="selectGrade('2')"
      >2학년</button>
      <button
        :class="{ active: selectedGrade === '3' }"
        @click="selectGrade('3')"
      >3학년</button>
    </div>

    <!-- 검색 박스 -->
    <div class="search-box">
      <input
        type="text"
        placeholder="공지사항 제목 검색"
        v-model="keyword"
        @keyup.enter="loadNotices"
      />
      <button @click="loadNotices">검색</button>
    </div>

    <!-- 공지 목록 테이블 -->
    <table class="notice-table">
      <thead>
        <tr>
          <th style="width: 40px;">
            <input type="checkbox" @change="toggleAll" />
          </th>
          <th style="width:60px;">번호</th>
          <th>제목</th>
          <th style="width:80px;">대상</th>
          <th style="width:80px;">작성자</th>
          <th style="width:120px;">작성일</th>
          <th style="width:60px;">조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="notice in notices"
          :key="notice.id"
          @click="goDetail(notice.id)"
        >
          <td @click.stop>
            <input
              type="checkbox"
              v-model="selectedIds"
              :value="notice.id"
            />
          </td>
          <td>
            <!-- 중요 공지면 ❤️ 표시 -->
            <span v-if="notice.is_important">❤️</span>
            <span v-else>{{ notice.id }}</span>
          </td>
          <td>{{ notice.title }}</td>
          <td>{{ notice.target_grade === 'all' ? '전체' : notice.target_grade + '학년' }}</td>
          <td>{{ notice.author_id }}번 유저</td>
          <td>{{ formatDate(notice.created_at) }}</td>
          <td>{{ notice.view_count }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 선택된 개수 및 삭제 버튼 -->
    <div class="selected-info" v-if="selectedIds.length > 0">
      <p>{{ selectedIds.length }}건 선택됨</p>
      <button @click="deleteSelected">삭제</button>
    </div>

    <!-- 작성 버튼: 관리자/교수만 -->
    <button v-if="isAdminOrProfessor" @click="showModal = true" class="create-button">
      공지사항 작성
    </button>

    <!-- 작성 모달 -->
    <NoticeModal
      v-if="showModal"
      @close="showModal = false"
      @created="handleCreated"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../store/authStore.js";
import { fetchNotices, deleteNoticesBulk } from "../../api/notice.js";
import NoticeModal from "./NoticeModal.vue";

export default {
  name: "NoticeList",
  components: { NoticeModal },
  setup() {
    const authStore = useAuthStore();
    
    // 사용자가 관리자 또는 교수인지 확인
    const isAdminOrProfessor = computed(() => authStore.isAdmin || authStore.isProfessor);

    const notices = ref([]); // 공지사항 목록
    const selectedGrade = ref("all"); // 선택한 학년
    const keyword = ref(""); // 검색어
    const selectedIds = ref([]); // 체크된 공지사항 ID 목록
    const showModal = ref(false); // 작성 모달 표시 여부

    /**
     * 📌 공지사항 목록 불러오기
     */
    const loadNotices = async () => {
      try {
        const params = {};
        if (selectedGrade.value) params.grade = selectedGrade.value;
        if (keyword.value) params.keyword = keyword.value;
        const data = await fetchNotices(params);
        notices.value = data;
        selectedIds.value = [];
      } catch (error) {
        console.error("공지사항 조회 오류:", error);
      }
    };

    /**
     * 📌 학년 필터 선택
     */
    const selectGrade = (g) => {
      selectedGrade.value = g;
      loadNotices();
    };

    /**
     * 📌 전체 체크박스 선택/해제
     */
    const toggleAll = (e) => {
      if (e.target.checked) {
        selectedIds.value = notices.value.map(n => n.id);
      } else {
        selectedIds.value = [];
      }
    };

    /**
     * 📌 선택한 공지사항 삭제
     */
    const deleteSelected = async () => {
      if (!confirm("정말로 삭제하시겠습니까?")) return;
      try {
        await deleteNoticesBulk(authStore.token, selectedIds.value);
        alert("삭제 완료");
        loadNotices();
      } catch (error) {
        alert("삭제 오류: " + error.response?.data?.error);
      }
    };

    /**
     * 📌 공지사항 상세 페이지 이동
     */
    const goDetail = (id) => {
      window.location.href = `/notice/${id}`;
    };

    /**
     * 📌 작성 모달이 닫히면 목록 새로고침
     */
    const handleCreated = () => {
      showModal.value = false;
      loadNotices();
    };

    /**
     * 📌 날짜 포맷 변환 함수
     */
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    };

    // 컴포넌트가 마운트될 때 공지사항 목록 로드
    onMounted(() => {
      loadNotices();
    });

    return {
      notices,
      selectedGrade,
      keyword,
      selectedIds,
      showModal,
      isAdminOrProfessor,
      loadNotices,
      selectGrade,
      toggleAll,
      deleteSelected,
      goDetail,
      handleCreated,
      formatDate,
    };
  },
};
</script>

<style scoped>
.notice-list-container {
  margin: 20px;
}
.grade-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.grade-tabs button {
  padding: 6px 12px;
  cursor: pointer;
}
.grade-tabs .active {
  background: #ffcccc;
}
.search-box {
  margin-bottom: 10px;
}
.notice-table {
  width: 100%;
  border-collapse: collapse;
}
.notice-table th, .notice-table td {
  border: 1px solid #ccc;
  padding: 8px;
}
.notice-table tr:hover {
  background: #f9f9f9;
}
.selected-info {
  background: #ffeaea;
  padding: 8px;
  margin-top: 10px;
  color: #c00;
}
.create-button {
  margin-top: 15px;
  padding: 8px 12px;
  border: none;
  background: #007bff;
  color: #fff;
  cursor: pointer;
}
</style>
