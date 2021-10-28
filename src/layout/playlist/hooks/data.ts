import { reactive, ref } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";

import type { MatchItem } from "../type";

export const musicItemList = ref<Map<number, MatchItem>>(new Map());

export const distance = ref(0);

export const gainValue = ref(20);

export const lyricNodeRect = reactive({
  offsetHeight: 0,
  scrollHeight: 0,
});

export const clientHeight = ref(0);

export const index = ref(0);
