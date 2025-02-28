<template>
    <div>
      <NavBar />
      <h1>📢 공지사항</h1>
      <ul>
        <li v-for="notice in notices" :key="notice.id">
          <h3>{{ notice.title }}</h3>
          <p>{{ notice.content }}</p>
        </li>
      </ul>
    </div>
  </template>
  
<script>
import NavBar from '../components/NavBar.vue';
  // import { fetchNotices } from '../api/notices';

export default {
  components: { NavBar },
  data() {
    return { notices: [] };
  },
  async mounted() {
    this.notices = await fetchNotices();
  }
};
  </script>
  