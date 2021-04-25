import { reactive } from "@vue/runtime-core";

export default {
  listTitle: reactive({
    cloud: {
      title: "云音乐特色榜",
      data: [],
    },
    global: {
      title: "全球媒体榜",
      data: [],
    },
  }),
};
