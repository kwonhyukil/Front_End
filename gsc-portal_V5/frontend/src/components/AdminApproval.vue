<template>
  <div class="admin-approval">
    <h2>관리자 승인 페이지</h2>
    <table>
      <thead>
        <tr>
          <th>이메일</th>
          <th>이름</th>
          <th>학번</th>
          <th>권한</th>
          <th>상태</th>
          <th>승인/거부</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="reg in registrations"
          :key="reg.id"
        >
          <td>{{ reg.email }}</td>
          <td>{{ reg.name }}</td>
          <td>{{ reg.student_id }}</td>
          <td>{{ reg.role_id===1 ? '관리자' : reg.role_id===2 ? '교수' : '학생' }}</td>
          <td>{{ reg.status }}</td>
          <td v-if="reg.status==='pending'">
            <button @click="approveReg(reg.id)">승인</button>
            <button @click="rejectReg(reg.id)">거부</button>
          </td>
          <td v-else>{{ reg.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { fetchRegistrations, approveRegistrationRequest, rejectRegistrationRequest } from "../api/user.js";
import { useAuthStore } from "../store/authStore.js";

export default {
  name: "AdminApproval",
  setup() {
    const registrations = ref([]);
    const authStore = useAuthStore();

    const loadData = async () => {
      const data = await fetchRegistrations(authStore.token);
      registrations.value = data;
    };
    onMounted(() => {
      loadData();
    });

    const approveReg = async (id) => {
      if (!confirm("이 사용자를 승인하시겠습니까?")) return;
      await approveRegistrationRequest(authStore.token, id);
      alert("승인 완료");
      loadData();
    };
    const rejectReg = async (id) => {
      if (!confirm("이 사용자를 거부하시겠습니까?")) return;
      await rejectRegistrationRequest(authStore.token, id);
      alert("거부 완료");
      loadData();
    };

    return {
      registrations,
      loadData,
      approveReg,
      rejectReg,
    };
  },
};
</script>

<style scoped>
.admin-approval {
  margin: 20px;
}
.admin-approval table {
  width: 100%;
  border-collapse: collapse;
}
.admin-approval th, .admin-approval td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
</style>
