import { ref } from "@vue/reactivity";

export const AsideTags = ref([
  {
    index: "tag_1",
    icon: "iconbiaoqianA01_shouye-36",
    title: "主页",
    path: "/index",
  },
  {
    index: "tag_2",
    icon: "iconjinghao",
    title: "探索",
    path: "/explore",
  },
  {
    index: "tag_3",
    icon: "iconbiaoqiankuozhan_xinxi-357",
    title: "信息",
    path: "/index",
  },
  {
    index: "tag_4",
    icon: "iconshuqian",
    title: "订阅",
    path: "/index",
  },
  {
    index: "tag_5",
    icon: "iconren-",
    title: "个人资料",
    path: "/index",
  },
  {
    index: "tag_6",
    icon: "icongengduo-copy",
    title: "更多",
    path: "/index",
  },
]);

export const currentIndex = ref(0);

export const moveIndex = ref(0);
