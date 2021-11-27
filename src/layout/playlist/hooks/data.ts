import { reactive, ref } from "@vue/reactivity";

export const distance = ref(0);

export const gainValue = ref(20);

export const lyricNodeRect = reactive({
  offsetHeight: 0,
  scrollHeight: 0,
  scrollShiHeight: 0,
});

export const clientHeight = ref(0);

export const index = ref(0);
