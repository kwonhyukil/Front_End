<template>
    <div class="events-container">
      <h1>🎉 학과 행사 및 교수 일정</h1>
  
      <button v-if="!isAuthorized" @click="connectGoogleCalendar">
        🔗 Google 캘린더 연동
      </button>
  
      <div v-else>
        <h2>📆 Google 캘린더 일정</h2>
        <ul v-if="events.length > 0">
          <li v-for="event in events" :key="event.id">
            <strong>{{ event.summary }}</strong> - 
            <span>{{ formatDate(event.start.dateTime || event.start.date) }}</span>
          </li>
        </ul>
        <p v-else>📌 일정이 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axios from "axios";
  
  const events = ref([]);
  const isAuthorized = ref(false);
  
  const connectGoogleCalendar = () => {
    window.location.href = import.meta.env.VITE_BACKEND_URL + "/calendar/google/auth";
  };
  
  const fetchGoogleCalendarEvents = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/calendar/events");
      events.value = response.data.events;
      isAuthorized.value = true;
    } catch (error) {
      console.error("❌ Google 캘린더 데이터를 불러오지 못했습니다.", error);
      isAuthorized.value = false;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  onMounted(() => {
    fetchGoogleCalendarEvents();
  });
  </script>
  
  <style scoped>
  .events-container {
    text-align: center;
    margin-top: 20px;
  }
  button {
    background-color: #4285f4;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
  }
  </style>
  