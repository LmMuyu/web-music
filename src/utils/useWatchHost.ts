import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

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
