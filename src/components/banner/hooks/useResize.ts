import { computed, ref } from "vue";
import { debounce } from "../../../utils/debounce";

export const watchNodeSize = (el?: HTMLElement) => {
  const height = ref("100%");
  if (!el) return computed(() => height);

  const resizeEvent = (entries: ResizeObserverEntry) => {
    const content = entries.contentRect;
    height.value = 2 * Math.round(content.width / 3.2) + "px";
  };

  const _debounce = debounce(resizeEvent);
  const resize = new ResizeObserver(_debounce);

  resize.observe(el);

  return computed(() => height);
};
