<template>
  <div class="notice-list container">
    <h2>📢 공지사항</h2>

    <!-- 🔹 학년별 필터 버튼 -->
    <div class="filters">
      <button :class="{ active: selectedGrade === 'all' }" @click="selectGrade('all')">전체</button>
      <button :class="{ active: selectedGrade === '1' }" @click="selectGrade('1')">1학년</button>
      <button :class="{ active: selectedGrade === '2' }" @click="selectGrade('2')">2학년</button>
      <button :class="{ active: selectedGrade === '3' }" @click="selectGrade('3')">3학년</button>
      <input type="text" v-model="keyword" placeholder="검색어 입력" @keyup.enter="loadNotices" />
      <button @click="loadNotices">검색</button>
    </div>

    <!-- 🔹 공지사항 목록 -->
    <table class="notice-table">
      <thead>
        <tr>
          <th style="width:70px;">번호</th>
          <th>제목</th>
          <th style="width:80px;">대상학년</th>
          <th style="width:100px;">작성자</th>
          <th style="width:150px;">작성일자</th>
          <th style="width:80px;">조회수</th>
        </tr>
      </thead>
      <tbody>
        <!-- 🔹 중요 공지는 항상 맨 위 -->
        <tr v-for="item in importantNotices" :key="'important-' + item.id" class="important-row" @click="goDetail(item.id)">
          <td>❤️</td>
          <td>{{ item.title }}</td>
          <td>{{ item.target_grade === 'all' ? '전체' : item.target_grade + '학년' }}</td>
          <td>{{ item.author }}</td>
          <td>{{ formatDate(item.created_at) }}</td>
          <td>{{ item.view_count }}</td>
        </tr>

        <!-- 🔹 일반 공지 (1번부터 순차적으로) -->
        <tr v-for="(item, index) in paginatedNotices" :key="item.id" @click="goDetail(item.id)">
          <td>{{ index + 1 }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.target_grade === 'all' ? '전체' : item.target_grade + '학년' }}</td>
          <td>{{ item.author }}</td>
          <td>{{ formatDate(item.created_at) }}</td>
          <td>{{ item.view_count }}</td>
        </tr>

        <!-- ✅ 10개가 안될 경우 빈 줄 유지 -->
        <tr v-for="n in emptyRows" :key="'empty-' + n">
          <td colspan="6" class="empty-row"></td>
        </tr>
      </tbody>
    </table>

    <!-- 🔹 페이지네이션 -->
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">◀</button>
      <span v-for="page in totalPages" :key="page" 
            :class="{ active: currentPage === page }"
            @click="goToPage(page)">
        {{ page }}
      </span>
      <button @click="nextPage" :disabled="currentPage === totalPages">▶</button>
    </div>

    <button class="write-button" v-if="isAdminOrProfessor" @click="showModal = true">공지사항 작성</button>
    <NoticeModal v-if="showModal" @close="showModal = false" @created="loadNotices" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { fetchNotices } from "../../api/notice.js";
import NoticeModal from "./NoticeModal.vue";
import { useAuthStore } from "../../store/authStore.js";

export default {
  name: "NoticeList",
  components: { NoticeModal },
  setup() {
    const notices = ref([]);
    const selectedGrade = ref("all");
    const keyword = ref("");
    const showModal = ref(false);
    const authStore = useAuthStore();

    const isAdminOrProfessor = computed(() => authStore.isAdmin || authStore.isProfessor);

    const currentPage = ref(1);
    const noticesPerPage = 10;

    /**
     * ✅ 공지사항 불러오기
     */
    const loadNotices = async () => {
      try {
        const params = {};
        if (selectedGrade.value !== "all") params.grade = selectedGrade.value;
        if (keyword.value) params.keyword = keyword.value;
        const data = await fetchNotices(params);
        notices.value = data;
        currentPage.value = 1;
      } catch (err) {
        console.error("공지사항 로드 오류:", err);
      }
    };

    /**
     * ✅ 중요 공지와 일반 공지를 구분하여 정렬
     */
    const importantNotices = computed(() => {
      return notices.value.filter((n) => n.is_important);
    });

    const normalNotices = computed(() => {
      return notices.value
        .filter((n) => !n.is_important)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    });

    /**
     * ✅ 페이지네이션 적용 (중요 공지는 항상 맨 위)
     */
    const totalPages = computed(() => Math.ceil(normalNotices.value.length / noticesPerPage));

    const paginatedNotices = computed(() => {
      const start = (currentPage.value - 1) * noticesPerPage;
      return normalNotices.value.slice(start, start + noticesPerPage);
    });

    /**
     * ✅ 테이블 크기 유지 (10개 미만이면 빈 줄 추가)
     */
    const emptyRows = computed(() => {
      return Math.max(0, noticesPerPage - paginatedNotices.value.length);
    });

    /**
     * ✅ 페이지 이동 함수
     */
    const goToPage = (page) => {
      currentPage.value = page;
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    /**
     * ✅ 학년 선택 버튼 클릭 시 필터 변경
     */
    const selectGrade = (grade) => {
      selectedGrade.value = grade;
      loadNotices();
    };

    /**
     * ✅ 공지사항 상세 페이지 이동
     */
    const goDetail = (id) => {
      window.location.href = `/notice/${id}`;
    };

    /**
     * ✅ 날짜 포맷 함수
     */
    const formatDate = (str) => {
      if (!str) return "";
      const d = new Date(str);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`;
    };

    onMounted(() => loadNotices());

    return {
      notices,
      importantNotices,
      paginatedNotices,
      emptyRows,
      selectedGrade,
      keyword,
      currentPage,
      totalPages,
      showModal,
      loadNotices,
      selectGrade,
      goToPage,
      prevPage,
      nextPage,
      goDetail,
      isAdminOrProfessor,
      formatDate,
    };
  },
};
</script>

<style scoped>
.notice-list {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.filters button.active {
  background: #ffc107;
  color: #fff;
}
.notice-table {
  width: 100%;
  border-collapse: collapse;
}
.notice-table th, .notice-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.notice-table tr:hover {
  background: #f9f9f9;
  cursor: pointer;
}
.delete-section {
  margin-top: 10px;
  background: #ffeaea;
  padding: 10px;
  color: #c00;
}
.write-button {
  margin-top: 10px;
  background: #28a745;
}
</style>
