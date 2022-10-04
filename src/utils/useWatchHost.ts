import { ref, watchEffect, Ref } from "vue";
import { useRoute } from "vue-router";
import router from "../routes";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { MyReturnType } from "../type";

function useWatchRoutePath(): Ref<RouteLocationNormalizedLoaded>;
function useWatchRoutePath(
  callback?: (route: RouteLocationNormalizedLoaded) => void
): MyReturnType<typeof watchEffect>;
function useWatchRoutePath(
  callback?: (route: RouteLocationNormalizedLoaded) => void
) {
  const RLNL = ref<Partial<RouteLocationNormalizedLoaded>>({});
  let route = useRoute();
  route = route ?? router.currentRoute.value;
  let prepath = "/";

  const stop = watchEffect(() => {
    if (prepath !== route.path) {
      prepath = route.path;
      RLNL.value = route;
      callback?.(route);
    }
  });

  return callback ? stop : RLNL;
}

function useWatchHost() {
  const excludes = ["/login", "/playlist", "/user", "/video"];

  const route = useRoute();
  const isshow = ref(true);

  watchEffect(() => {
    const routePath = route.path;
    const showTags = route.meta.showTags;
    const is =
      showTags === false
        ? true
        : excludes.some((path) => path.indexOf(routePath) > -1);
    isshow.value = is ? false : true;
  });

  return isshow;
}

export { useWatchHost, useWatchRoutePath };
