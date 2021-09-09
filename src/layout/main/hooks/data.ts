import { ref, computed } from "@vue/reactivity";
import { useStore } from "vuex";

import type { ComputedRef } from "vue";

type retRevisePath = ComputedRef<
  {
    index: string;
    icon: string;
    title: string;
    path: string;
    target?: string;
  }[]
>;

export function revisePath(pathList: string[]): retRevisePath {
  const islogin = useStore().getters["login/getIslogin"];

  const AsideTags = [
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

  return computed(() => {
    console.log(islogin);
    if (!islogin) {
      return AsideTags.map((pathinstance) => {
        if (pathList.indexOf(pathinstance.path) > -1) {
          return {
            ...pathinstance,
            path: "/login",
            target: "_blank",
          };
        }

        return pathinstance;
      });
    } else {
      return AsideTags;
    }
  });
}

export const currentIndex = ref(0);

export const moveIndex = ref(0);
