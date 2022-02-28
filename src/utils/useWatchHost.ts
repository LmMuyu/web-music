import { ref, watchEffect } from "vue";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";

export function useWatchRoutePath() {
  const RLNL = ref<Partial<RouteLocationNormalizedLoaded>>({});
  const route = useRoute();
  let prepath = "";

  watchEffect(() => {
    if (prepath !== route.path) {
      prepath = route.path;
      RLNL.value = route;
    }
  });

  return RLNL;
}

export function useWatchHost() {
  const excludes = ["/login", "/playlist", "/user"];

  const route = useRoute();
  const isshow = ref(true);

  watchEffect(() => {
    const routePath = route.path;
    const showTags = route.meta.showTags;
    const is = showTags === false ? true : excludes.some((path) => path.indexOf(routePath) > -1);
    isshow.value = is ? false : true;
  });

  return isshow;
}
