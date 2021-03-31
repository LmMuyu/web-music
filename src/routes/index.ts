import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import scrollBehavior from "./scrollBehavior";

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior,
});

export default router;
