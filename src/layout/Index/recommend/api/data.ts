import { ref } from "vue";

export const discoverMusic = [
  {
    tagName: "华语",
    area: "ZH",
  },
  {
    tagName: "欧美",
    area: "EA",
  },
  {
    tagName: "韩语",
    area: "KR",
  },

  {
    tagName: "日语",
    area: "JP",
  },
];

export const activeCurrent = ref(Number.MAX_SAFE_INTEGER);
