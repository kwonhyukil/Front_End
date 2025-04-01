<template>
    <div>
      <NavBar />
      <h1>📅 시간표</h1>
      <ul>
        <li v-for="event in events" :key="event.id">
          {{ event.summary }} - {{ event.start.dateTime || event.start.date }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import NavBar from '../components/NavBar.vue';
  import { fetchCalendarEvents } from '../api/calendar';
  
  export default {
    components: { NavBar },
    data() {
      return { events: [] };
    },
    async mounted() {
      this.events = await fetchCalendarEvents();
    }
  };
  </script>
  