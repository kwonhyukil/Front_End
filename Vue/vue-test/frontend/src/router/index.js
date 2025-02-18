import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Notices from "../pages/Notices.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/notices", component: Notices },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
