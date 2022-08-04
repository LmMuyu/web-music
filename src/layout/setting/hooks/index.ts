import { h } from "vue";

import loading from "../../../components/svgloading/SvgLoading.vue";
import { ElRow, ElCol } from "element-plus";

export const setting = ["账号", "常规", "播放", "信息", "歌词"];

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
