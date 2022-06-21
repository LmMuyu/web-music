import type { RouterScrollBehavior } from "vue-router";
import store from "../store";

type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer O
  ? O
  : never;

const scrollBehavior: RouterScrollBehavior = (to, FormData, savePosition) => {
  const scrollMap = store.getters["getPathScrollMap"] as Map<
    string,
    MyReturnType<RouterScrollBehavior>
  >;

  if (scrollMap.has(to.path)) {
    const behavior = scrollMap.get(to.path);
    return {};
  } else {
    return {
      left: 0,
      top: 0,
    };
  }
};

export default scrollBehavior;
