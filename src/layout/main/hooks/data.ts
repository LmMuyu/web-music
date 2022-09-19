import { ref } from "@vue/reactivity";

export const AsideTags = [
  {
    index: "tag_1",
    icon: "iconbiaoqianA01_shouye-36",
    title: "主页",
    path: "/index",
    islogin: false,
  },
  {
    index: "tag_2",
    icon: "iconjinghao",
    title: "探索",
    path: "/explore",
    islogin: false,
  },
  {
    index: "tag_3",
    icon: "iconbiaoqiankuozhan_xinxi-357",
    title: "信息",
    path: "/message",
    islogin: true,
  },
  {
    index: "tag_4",
    icon: "iconshuqian",
    title: "订阅",
    path: "/subscription",
    islogin: true,
  },
  {
    index: "tag_5",
    icon: "iconren-",
    title: "个人资料",
    path: "/user/home",
    islogin: true,
  },

  {
    index: "tag_7",
    icon: "iconzhankai",
    title: "最近播放",
    path: "/latelyplay",
    islogin: false,
  },
  {
    index: "tag_8",
    icon: "icongengduo-copy",
    title: "设置",
    path: "/setting",
    islogin: false,
  },
];

export const currentIndex = ref(0);

export const moveIndex = ref(0);
