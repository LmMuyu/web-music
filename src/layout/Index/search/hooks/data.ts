import { reactive } from "@vue/reactivity";

export const showTheBar = reactive<{
  showBar: boolean;
  keyword: string;
  renderData: Record<string, any>[];
}>({
  showBar: false,
  keyword: "",
  renderData: [],
});
