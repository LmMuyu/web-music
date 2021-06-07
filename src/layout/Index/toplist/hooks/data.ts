import { reactive, ref } from "@vue/runtime-core";
import { ListTitle } from "../types/dataType";
import type { ListItem } from "../types/requestType";

export const listTitle = reactive<ListTitle>({
  cloud: {
    index: 100,
    title: "云音乐特色榜",
    childrenData: [],
  },
  global: {
    index: 101,
    title: "全球媒体榜",
    childrenData: [],
  },
});

export const mainMapData = ref(new Map());
export const elementScrollTop = ref(0);
export const rowTop = ref(0);

export const mainShowData = ref<ListItem[]>([]);

export const rowRoot = ref<HTMLElement | null>(null);
