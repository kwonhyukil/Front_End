<template>
  <div>
    <button @click="startGoogleAuth">Google Calendar 연동</button>
    <div v-if="events.length">
      <h3>📅 나의 캘린더 일정</h3>
      <ul>
        <li v-for="event in events" :key="event.id">
          {{ event.summary }} ({{ event.start.dateTime }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';

const events = ref([]);

const startGoogleAuth = () => {
  window.location.href = 'http://localhost:8080/calendar/google/callback';
};
</script>
