import { isReactive, isRef, unref, watch, WatchCallback, WatchOptions } from "vue";
import { useType } from "./index";

export function useWatch(
  watchkey: any,
  backcall: WatchCallback<string, string>,
  options: WatchOptions<false>
) {
  if (!(isReactive(watchkey) || isRef(watchkey))) {
    return;
  }

  const includeTypes = ["Function", "Array", "Object"];
  const type = useType(unref(watchkey));
  console.log(type);
  const iscomplex = includeTypes.includes(type);

  return watch(iscomplex ? () => watchkey : watchkey, backcall, options);
}
