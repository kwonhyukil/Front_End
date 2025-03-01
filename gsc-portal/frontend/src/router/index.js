import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import AuthPage from "../views/AuthPage.vue";
import TimetablePage from "../views/TimetablePage.vue";
import NoticesPage from "../views/NoticesPage.vue";
import AuthCallback from "../views/Authcallback.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/auth", component: AuthPage },
  { path: "/timetable", component: TimetablePage },
  { path: "/notices", component: NoticesPage },
  { path: "/auth/callback", component: AuthCallback },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
