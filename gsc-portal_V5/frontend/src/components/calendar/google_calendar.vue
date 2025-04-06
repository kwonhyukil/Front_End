<!-- GoogleCalendar.vue -->
<template>
    <div>
      <button @click="handleAuthClick">구글 로그인</button>
      <button @click="listUpcomingEvents">이벤트 불러오기</button>
      <ul>
        <li v-for="event in events" :key="event.id">{{ event.summary }} ({{ event.start.dateTime || event.start.date }})</li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { gapi } from 'gapi-script'
  
  const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com'
  const API_KEY = 'YOUR_API_KEY'
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly'
  
  const events = ref([])
  
  const initClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
      })
      .then(() => {
        console.log('GAPI client initialized.')
      })
  }
  
  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn()
  }
  
  const listUpcomingEvents = () => {
    gapi.client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime'
      })
      .then((response) => {
        events.value = response.result.items
      })
      .catch((error) => {
        console.error('Error fetching events:', error)
      })
  }
  
  onMounted(() => {
    gapi.load('client:auth2', initClient)
  })
  </script>
  