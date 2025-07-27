import { createWebHistory, createRouter } from "vue-router";

import HomeView from "@src/pages/Home.vue";
import JsonView from "@src/pages/JsonView.vue";
import Home from "@src/pages/home/index.vue";

const routes = [
  { path: "/", redirect: "/home" },
  { path: "/svg", component: HomeView },
  { path: "/json", component: JsonView },
  { path: "/home", component: Home },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
