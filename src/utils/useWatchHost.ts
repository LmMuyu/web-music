import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

export function useWatchHost() {
  const excludes = ["/login", "/playlist"];

  const route = useRoute();
  const isshow = ref(true);

  watchEffect(() => {
    const routePath = route.path;
    const is = excludes.some((path) => path.indexOf(routePath) > -1);

    if (is) {
      isshow.value = false;
    } else {
      isshow.value = true;
    }
  });

  return isshow;
}
