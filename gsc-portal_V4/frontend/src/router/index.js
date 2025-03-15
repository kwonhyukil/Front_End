// [경로: frontend/src/router/index.js]
import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/auth/Login.vue";
import Logout from "../components/auth/Logout.vue";
import NoticeList from "../components/notice/NoticeList.vue";
import NoticeDetail from "../components/notice/NoticeDetail.vue";
import ScheduleViewer from "../components/schedule/ScheduleViewer.vue";
import AdminApproval from "../components/AdminApproval.vue";
import Profile from "../components/Profile.vue";
import { useAuthStore } from "../store/authStore.js";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/notice", component: NoticeList },
  { path: "/notice/:id", component: NoticeDetail },
  { path: "/schedule", component: ScheduleViewer },
  { path: "/admin-approval", component: AdminApproval },
  { path: "/profile", component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 전역 가드
 * - 관리자/교수 전용(공지사항 삭제 등)
 * - 로그인 필요 페이지
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // 로그인 필요 라우트
  const authRequired = ["/logout", "/profile", "/admin-approval", "/schedule"];
  if (authRequired.includes(to.path) && !authStore.isAuthenticated) {
    return next("/login");
  }

  // 관리자 or 교수만
  if (to.path === "/admin-approval") {
    if (!authStore.isAdmin && !authStore.isProfessor) {
      return next("/home");
    }
  }

  return next();
});

export default router;