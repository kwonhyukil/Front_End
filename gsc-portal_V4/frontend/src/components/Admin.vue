<template>
    <div class="admin-page">
      <h2>관리자 페이지</h2>
  
      <!-- 🔹 관리자 전용 네비게이션 탭 -->
      <div class="admin-tabs">
        <button :class="{ active: activeTab === 'approval' }" @click="activeTab = 'approval'">
          사용자 승인 관리
        </button>
        <button :class="{ active: activeTab === 'notice' }" @click="activeTab = 'notice'">
          공지 관리
        </button>
        <button :class="{ active: activeTab === 'timetable' }" @click="activeTab = 'timetable'">
          시간표 관리
        </button>
      </div>
  
      <!-- 🔹 탭별 동적 컴포넌트 -->
      <div class="admin-content">
        <AdminApproval v-if="activeTab === 'approval'" />
        <NoticeManagement v-if="activeTab === 'notice'" />
        <TimetableManagement v-if="activeTab === 'timetable'" />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import { useAuthStore } from "../../store/authStore.js";
  import { useRouter } from "vue-router";
  
  // 🔹 하위 관리자 페이지 컴포넌트 가져오기
  import AdminApproval from "./AdminApproval.vue";
  import NoticeManagement from "./NoticeManagement.vue";
  import TimetableManagement from "./TimetableManagement.vue";
  
  export default {
    name: "Admin",
    components: {
      AdminApproval,
      NoticeManagement,
      TimetableManagement,
    },
    setup() {
      const authStore = useAuthStore();
      const router = useRouter();
      const activeTab = ref("approval"); // 기본 탭: 사용자 승인 관리
  
      // 🔹 관리자 권한 확인 (관리자가 아니라면 홈으로 이동)
      onMounted(() => {
        if (!authStore.isAdmin) {
          alert("관리자 권한이 필요합니다.");
          router.push("/home");
        }
      });
  
      return {
        activeTab,
      };
    },
  };
  </script>
  
  <style scoped>
  .admin-page {
    margin: 20px;
  }
  
  /* 🔹 관리자 탭 스타일 */
  .admin-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .admin-tabs button {
    padding: 8px 15px;
    border: none;
    background: #ddd;
    cursor: pointer;
  }
  
  .admin-tabs .active {
    background: #007bff;
    color: white;
  }
  
  .admin-content {
    border: 1px solid #ccc;
    padding: 20px;
    background: #f9f9f9;
  }
  </style>
  