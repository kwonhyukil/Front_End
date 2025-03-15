<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import { computed } from "vue";
import { useAuthStore } from "./store/authStore";
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  setup() {
    const authStore = useAuthStore();
    const isAuthenticated = computed(() => authStore.token !== null);
    return { isAuthenticated };
  },
};
</script>

<style>
#app {
  font-family: "Arial", sans-serif;
  text-align: center;
  margin: 0;
}
</style>
