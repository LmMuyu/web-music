import { reactive, ref } from "@vue/reactivity";

export const showTheBar = reactive<{
  showBar: boolean;
  keyword: string;
  renderData: Record<string, any>[];
}>({
  showBar: false,
  keyword: "",
  renderData: [],
});

export const titleMap = new Map([
  ["song", "歌曲"],
  ["playList", "歌单"],
  ["video", "视频"],
]);

export const mainContent = ref<HTMLElement | null>(null);
