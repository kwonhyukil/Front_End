import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import AuthCallback from "../views/AuthCallback.vue";
import RegisterPage from "../views/RegisterPage.vue";
import SchedulePage from "../views/SchedulePage.vue";
import NoticesPage from "../views/NoticesPage.vue";
import EventsPage from "../views/EventsPage.vue";
import NotFound from "../views/NotFound.vue"; // ✅ 404 페이지 추가

const routes = [
  { path: "/home", name: "Home", component: HomePage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/auth/callback", name: "AuthCallback", component: AuthCallback },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/", redirect: "/home" }, // ✅ 루트 URL은 /home으로 이동
  { path: "/:pathMatch(.*)*", component: NotFound }, // ✅ 404 페이지 설정
  { path: "/schedule", name: "schedule", component: SchedulePage }, // 📅 시간표 페이지
  { path: "/notices", name: "Notices", component: NoticesPage }, // 📢 공지사항 페이지
  { path: "/events", name: "events", component: EventsPage }, // 학과 행사 일정 페이지
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
