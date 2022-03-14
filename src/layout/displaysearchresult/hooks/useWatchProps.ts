import { getCurrentInstance, isRef, ref, Ref, watchEffect } from "vue";
import { isType } from "../../../utils/methods";

function filterRepeat<T extends Object | Array<any>>(
  newObj: T,
  cacheMap: WeakMap<T, number>,
  compuid: number
): T {
  const hasobj = cacheMap.has(newObj);
  const cuid = cacheMap.get(newObj);
  const sttype = isType(newObj);
  let data = null;

  if (!hasobj) {
    cacheMap.set(newObj, compuid);
    if (sttype === "Array") {
      data = newObj;
    } else if (sttype === "Object") {
    }
  } else {
    if (sttype === "Array") {
      if (cuid === compuid) {
        data = [];
      } else {
        data = newObj;
      }
    } else if (sttype === "Object") {
    }
  }

  return data;
}

export default function useWatchProps<T, P extends Record<string, any>>(
  value: Ref<T>,
  propsvalue: P,
  t: keyof P
) {
  const isref = isRef(value);
  const retvalue = isref ? value : ref(null);
  const cacheArrMap = new WeakMap();
  const cacheObjMap = new WeakMap();

  const stop = watchEffect(() => {
    const data = propsvalue[t];
    console.log(data);
    const instance = getCurrentInstance.call(this);
    const isArr = isType(data) === "Array";
    const retdata = filterRepeat(data, isArr ? cacheArrMap : cacheObjMap, instance.uid);
    console.log(retdata);

    retvalue.value = retdata;
  });

  return {
    stop,
    retvalue,
  };
}
