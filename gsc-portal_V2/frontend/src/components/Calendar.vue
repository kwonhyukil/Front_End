<template>
    <FullCalendar :options="calendarOptions" />
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import FullCalendar from "@fullcalendar/vue3";
  
  const calendarOptions = ref({
    initialView: "dayGridMonth",
    events: [],
  });
  
  onMounted(async () => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/events");
    calendarOptions.value.events = await response.json();
  });
  </script>
  