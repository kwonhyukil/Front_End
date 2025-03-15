import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../store/authStore";
import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import AuthCallback from "../views/AuthCallback.vue";
import SchedulePage from "../views/SchedulePage.vue";
import NoticePage from "../views/NoticePage.vue";
import CalendarPage from "../views/CalendarPage.vue";
import AdminApprovalPage from "../views/AdminApprovalPage.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", name: "Home", component: HomePage },
  { path: "/login", name: "Login", component: LoginPage },
  { path: "/auth/callback", name: "AuthCallback", component: AuthCallback },
  {
    path: "/schedule",
    name: "Schedule",
    component: SchedulePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/notice",
    name: "Notice",
    component: NoticePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/calendar",
    name: "Calendar",
    component: CalendarPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    name: "AdminApproval",
    component: AdminApprovalPage,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ 인증 미들웨어 설정
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const isAdmin = authStore.user?.role === "관리자";

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login"); // ✅ 로그인 필요 페이지 접근 시 로그인 페이지로 이동
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next("/home"); // ✅ 관리자가 아닐 경우 홈으로 이동
  } else {
    next();
  }
});

export default router;
