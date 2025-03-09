<template>
    <div class="schedule">
      <h2>📆 학과 시간표</h2>
      
      <div v-if="isAdmin">
        <button @click="openModal">➕ 시간표 추가</button>
      </div>
  
      <table>
        <thead>
          <tr>
            <th>시간</th>
            <th v-for="day in days" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(time, index) in times" :key="index">
            <td>{{ time }}</td>
            <td v-for="day in days" :key="day">
              <div v-for="course in getCourses(day, time)" :key="course.id">
                <strong>{{ course.name }}</strong> ({{ course.professor }})
                <p>{{ course.classroom }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- 시간표 추가 모달 -->
      <div v-if="showModal" class="modal">
        <h3>시간표 추가</h3>
        <input v-model="newCourse.name" placeholder="과목명" />
        <input v-model="newCourse.professor" placeholder="교수명" />
        <input v-model="newCourse.classroom" placeholder="강의실" />
        <select v-model="newCourse.day">
          <option v-for="day in days" :key="day">{{ day }}</option>
        </select>
        <select v-model="newCourse.time">
          <option v-for="time in times" :key="time">{{ time }}</option>
        </select>
        <button @click="addCourse">저장</button>
        <button @click="showModal = false">취소</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import axios from "axios";
  
  const courses = ref([]);
  const isAdmin = ref(false);
  const showModal = ref(false);
  const newCourse = ref({
    name: "",
    professor: "",
    classroom: "",
    day: "월요일",
    time: "09:00 - 09:50",
  });
  
  const days = ["월요일", "화요일", "수요일", "목요일", "금요일"];
  const times = ["09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50", "12:00 - 12:50", "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50", "16:00 - 16:50", "17:00 - 17:50"];
  
  onMounted(async () => {
    const userRole = localStorage.getItem("role");
    isAdmin.value = userRole === "교수" || userRole === "관리자";
  
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/schedule");
    courses.value = response.data;
  });
  
  const getCourses = (day, time) => {
    return courses.value.filter(course => course.day === day && course.time === time);
  };
  
  const openModal = () => {
    showModal.value = true;
  };
  
  const addCourse = async () => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/schedule", newCourse.value);
    courses.value.push(response.data);
    showModal.value = false;
  };
  </script>
  
  <style scoped>
  .schedule { padding: 20px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #ddd; padding: 10px; text-align: center; }
  th { background-color: #f4f4f4; }
  .modal { background: white; padding: 20px; border: 1px solid #ddd; }
  </style>
  