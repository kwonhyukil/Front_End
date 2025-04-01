import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../views/MainPage.vue";
import HomePage from "../views/HomePage.vue";
import TimetablePage from "../views/TimetablePage.vue";
import NoticePage from "../views/NoticesPage.vue";
import LoginPage from "../views/LoginPage.vue";
import AuthPage from "../views/AuthPage.vue";

const routes = [
  { path: "/", name: "Main", component: MainPage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/home", name: "Home", component: HomePage },
  { path: "/timetable", name: "Timetable", component: TimetablePage },
  { path: "/notices", name: "Notices", component: NoticePage },
  { path: "/auth/callback", name: "AuthCallback", component: AuthPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
