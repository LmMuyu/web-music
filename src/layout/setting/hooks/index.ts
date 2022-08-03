import { h } from "vue";
import loading from "../../../components/svgloading/SvgLoading.vue";

export const setting = ["账号", "常规", "播放", "信息", "歌词"];

export function loadIcon() {
  return h(loading);
}
