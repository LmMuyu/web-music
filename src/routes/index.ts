import { createRouter, createWebHistory, RouteLocationRaw } from "vue-router";
import routes from "./routes";
import scrollBehavior from "./scrollBehavior";

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior,
});

const replace = router.replace.bind(router);

router.replace = function (to: RouteLocationRaw) {
  console.log(to);

  let newto = null;
  if (typeof to === "string") {
    newto = {
      path: to,
      params: {
        isReplace: true,
      },
    };
  } else {
    newto = Object.assign({}, to, {
      //@ts-ignore
      params: Object.assign(to?.params ?? {}, {
        isReplace: true,
      }),
    });
  }

  return replace(newto);
};

export default router;
