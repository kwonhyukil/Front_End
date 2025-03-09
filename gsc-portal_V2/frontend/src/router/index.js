// frontend/src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../views/HomePage.vue";
import LoginPage from "../views/LoginPage.vue";
import AuthCallback from "../views/AuthCallback.vue";
import RegisterPage from "../views/RegisterPage.vue";
import SchedulePage from "../views/SchedulePage.vue";
import NoticesPage from "../views/NoticesPage.vue";
import EventsPage from "../views/EventsPage.vue";
import AdminApprovalPage from "../views/AdminApprovalPage.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/home", component: HomePage },
  { path: "/login", component: LoginPage },
  { path: "/auth/callback", component: AuthCallback },
  { path: "/register", component: RegisterPage },
  { path: "/schedule", component: SchedulePage },
  { path: "/notices", component: NoticesPage },
  { path: "/events", component: EventsPage },
  { path: "/admin", component: AdminApprovalPage },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
