import { watch } from "vue";
import { promptbox } from "../../components/promptBox";

export function watchSettingUpdate(watchdata: any) {
  return watch(watchdata, () => {
    promptbox({ title: "设置已更新" });
  });
}
