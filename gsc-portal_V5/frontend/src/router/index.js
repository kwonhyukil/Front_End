// [frontend/src/router/index.js]
import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Login from "../components/auth/Login.vue";
import Logout from "../components/auth/Logout.vue";
import RegistrationForm from "../components/auth/RegistrationForm.vue";
import NoticeList from "../components/notice/NoticeList.vue";
import NoticeDetail from "../components/notice/NoticeDetail.vue";
import CalendarPage from "../components/calendar/google_calendar.vue";
import AdminApproval from "../components/AdminApproval.vue";
import Profile from "../components/Profile.vue";
import Timetable from "../components/timetable/Timetable.vue";
// import ScheduleViewer from "../components/schedule/ScheduleViewer.vue"; // 필요 시

import { useAuthStore } from "../store/authStore.js";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/registration", component: RegistrationForm },
  { path: "/notice", component: NoticeList },
  { path: "/notice/:id", component: NoticeDetail },
  { path: "/timetable", component: Timetable },
  { path: "/calendar", component: CalendarPage },
  { path: "/admin-approval", component: AdminApproval },
  { path: "/profile", component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // 예: 인증이 필요한 페이지
  const authRequired = [
    "/logout",
    "/profile",
    "/timetable",
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
