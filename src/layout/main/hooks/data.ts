import { ref } from "@vue/reactivity";
import store from "../../../store";

export const AsideTags = [
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
    path: "/message",
  },
  {
    index: "tag_4",
    icon: "iconshuqian",
    title: "订阅",
    path: "/subscription",
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
];

export function revisePath(topath: string, pathList: string[]) {
  let path = "";
  const islogin = store.getters["login/getIslogin"];

  if (!islogin) {
    const inpath = pathList.indexOf(topath) > -1;

    if (inpath) {
      path = "/login";
    } else {
      path = topath;
    }
  } else {
    path = topath;
  }

  return path;
}

export const currentIndex = ref(0);

export const moveIndex = ref(0);
