import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./HomePage.vue";
import About from "./AboutPage.vue";
import Movie from "./MoviePage.vue";

export default createRouter({
  // Hash
  // https://google.com/#/search
  history: createWebHashHistory(),
  // pages
  // https://google.com/
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/movie",
      component: Movie,
    },
    {
      path: "/about",
      component: About,
    },
  ],
});
