import { h, ref } from "vue";

import loading from "../../../components/svgloading/SvgLoading.vue";
import { ElRow, ElCol } from "element-plus";

let tid = 1;

class settingNode {
  tid: number;
  tag: string;
  targetTop: number;
  node: HTMLElement;
  constructor(tag: string) {
    this.tid = tid++;
    this.tag = tag;
    this.targetTop = 0;
    this.node = null;
  }
}

export const setting: settingNode[] = [
  new settingNode("账号"),
  new settingNode("常规"),
  new settingNode("播放"),
  new settingNode("信息"),
  new settingNode("歌词"),
];

export function loadIcon() {
  return h(loading, {
    class: "w-12",
  });
}

export function notContent() {
  return h(
    ElRow,
    {
      align: "middle",
    },
    [
      h(
        ElCol,
        {
          span: 4,
        },
        [loadIcon()]
      ),

      h(
        ElCol,
        {
          span: 20,
        },
        h(
          "span",
          {
            class: "px-4",
          },
          "修改头像中"
        )
      ),
    ]
  );
}
