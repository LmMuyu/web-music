import { defineComponent, reactive, ref } from "@vue/runtime-core";
import { ListTitle } from "../types/dataType";

export default defineComponent({
  setup() {
    const listTitle = reactive<ListTitle>({
      cloud: {
        title: "云音乐特色榜",
        childrenData: [],
      },
      global: {
        title: "全球媒体榜",
        childrenData: [],
      },
    });

    const mainMapData = ref(new Map());

    return {
      listTitle,
      mainMapData,
    };
  },
});
