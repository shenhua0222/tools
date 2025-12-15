import { createWebHistory, createRouter } from "vue-router";

import HomeView from "@src/pages/Home.vue";
import JsonView from "@src/pages/JsonView.vue";
import TableView from "@src/pages/TableView.vue";
import SvgDemoView from "@src/pages/SvgDemo.vue";

const routes = [
  { path: "/", redirect: "/json" },
  { path: "/svg", component: HomeView },
  { path: "/json", component: JsonView },
  { path: "/table", component: TableView },
  { path: "/svgdemo", component: SvgDemoView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
