import { createRouter, createWebHistory } from "vue-router";
import Home from "./project/Home.vue";
import Checkbox from "./project/checkbox.vue";
import Num from "./project/num.vue";

const routes = [
  { path: "/", component: Home }, // 메인 페이지
  { path: "/checkbox", component: Checkbox }, // 체크박스 페이지
  { path: "/num", component: Num }, // 숫자 카운트 페이지
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
