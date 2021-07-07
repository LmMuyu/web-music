import { ref } from "vue";

export function useMinWh() {
  const minwidth = ref(0);
  const minheight = ref(0);

  minwidth.value = (document.documentElement.clientWidth * 0.618) >>> 0;
  minheight.value = (document.documentElement.clientHeight * 0.99) >>> 0;

  return {
    minwidth,
    minheight,
  };
}
