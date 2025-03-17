// [frontend/src/router/index.js]
import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/auth/Login.vue";
import Logout from "../components/auth/Logout.vue";
import RegistrationForm from "../components/auth/RegistrationForm.vue";
import NoticeList from "../components/notice/NoticeList.vue";
import NoticeDetail from "../components/notice/NoticeDetail.vue";
import ScheduleViewer from "../components/schedule/ScheduleViewer.vue";
import CalendarPage from "../components/calendar/CalendarPage.vue";
import AdminApproval from "../components/AdminApproval.vue";
import Profile from "../components/Profile.vue";

import { useAuthStore } from "../store/authStore.js";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/registration", component: RegistrationForm },
  { path: "/notice", component: NoticeList },
  { path: "/notice/:id", component: NoticeDetail },
  { path: "/schedule", component: ScheduleViewer },
  { path: "/calendar", component: CalendarPage },
  { path: "/admin-approval", component: AdminApproval },
  { path: "/profile", component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 가드 (로그인 필요)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const authRequired = [
    "/logout",
    "/profile",
    "/schedule",
    "/notice",
    "/calendar",
    "/admin-approval",
  ];

  if (authRequired.includes(to.path) && !authStore.isAuthenticated) {
    return next("/login");
  }
  return next();
});

export default router;
