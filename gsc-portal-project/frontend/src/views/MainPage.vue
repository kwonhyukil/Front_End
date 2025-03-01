<template>
    <NavBar />
    
</template>

<script>
import NavBar from '../components/NavBar.vue';
//   import { fetchNotices } from '../api/notices';

export default {
  components: { NavBar },
  data() {
    return { notices: [] };
  },
  // async mounted() {
  //   this.notices = await fetchNotices();
  // }
};
</script>
