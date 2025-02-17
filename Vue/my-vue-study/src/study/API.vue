<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const users = ref([]);  // 사용자 목록
const newUser = ref({ name: "", email: "" }); // 새 사용자 정보

// 📌 1️⃣ 사용자 목록 가져오기
const fetchUsers = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/users");
        users.value = response.data;
    } catch (error) {
        console.error("사용자 목록 불러오기 실패:", error);
    }
};

// 📌 2️⃣ 새 사용자 추가하기
const addUser = async () => {
    try {
        await axios.post("http://localhost:5000/api/users", newUser.value);
        newUser.value = { name: "", email: "" }; // 입력 필드 초기화
        fetchUsers(); // 목록 다시 불러오기
    } catch (error) {
        console.error("사용자 추가 실패:", error);
    }
};

// 📌 3️⃣ 사용자 삭제하기
const deleteUser = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        fetchUsers(); // 목록 다시 불러오기
    } catch (error) {
        console.error("사용자 삭제 실패:", error);
    }
};

// 페이지 로드 시 사용자 목록 불러오기
onMounted(fetchUsers);
</script>

<template>
    <div>
        <h2>MySQL 사용자 목록</h2>

        <!-- 사용자 입력 폼 -->
        <div>
            <input v-model="newUser.name" placeholder="이름 입력" />
            <input v-model="newUser.email" placeholder="이메일 입력" />
            <button @click="addUser">추가</button>
        </div>

        <!-- 사용자 목록 표시 -->
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }} ({{ user.email }})
                <button @click="deleteUser(user.id)">삭제</button>
            </li>
        </ul>
    </div>
</template>
