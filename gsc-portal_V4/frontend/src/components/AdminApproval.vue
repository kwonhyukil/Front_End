<template>
  <div class="admin-approval-container">
    <h2>관리자 승인 페이지</h2>
    <p>가입 대기 사용자 목록</p>

    <!-- 가입 대기 목록 -->
    <table v-if="users.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>이름</th>
          <th>이메일</th>
          <th>전화번호</th>
          <th>권한</th>
          <th>승인</th>
          <th>거절</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone }}</td>
          <td>{{ getRole(user.role_id) }}</td>
          <td><button @click="approveUser(user.id)">✅ 승인</button></td>
          <td><button @click="rejectUser(user.id)">❌ 거절</button></td>
        </tr>
      </tbody>
    </table>

    <p v-else>가입 대기 목록이 없습니다.</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { fetchPendingUsers, approveUserRequest, rejectUserRequest } from "../api/admin.js";
import { useAuthStore } from "../store/authStore.js";

export default {
  name: "AdminApproval",
  setup() {
    const authStore = useAuthStore();
    const users = ref([]);

    // ✅ 가입 대기 목록 불러오기
    const loadUsers = async () => {
      try {
        const data = await fetchPendingUsers(authStore.token);
        users.value = data;
      } catch (error) {
        console.error("🚨 가입 대기 목록 조회 오류:", error.response?.data || error.message);
        alert("가입 대기 목록을 불러오는 중 오류 발생");
      }
    };

    // ✅ 사용자 승인
    const approveUser = async (userId) => {
      try {
        await approveUserRequest(authStore.token, userId);
        alert("사용자 승인 완료!");
        loadUsers();
      } catch (error) {
        console.error("🚨 승인 오류:", error.response?.data || error.message);
        alert("승인 중 오류 발생");
      }
    };

    // ✅ 사용자 거절
    const rejectUser = async (userId) => {
      try {
        await rejectUserRequest(authStore.token, userId);
        alert("사용자 거절 완료!");
        loadUsers();
      } catch (error) {
        console.error("🚨 거절 오류:", error.response?.data || error.message);
        alert("거절 중 오류 발생");
      }
    };

    // ✅ 역할 변환 함수
    const getRole = (roleId) => {
      return roleId === 1 ? "관리자" : roleId === 2 ? "교수" : "학생";
    };

    onMounted(() => {
      loadUsers();
    });

    return {
      users,
      loadUsers,
      approveUser,
      rejectUser,
      getRole,
    };
  },
};
</script>

<style scoped>
.admin-approval-container {
  margin: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
button {
  cursor: pointer;
}
</style>
