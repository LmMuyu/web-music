import { ref } from "@vue/reactivity";
import { Ref } from "vue";

interface Options {
  isGet: boolean;
}

function onStorageEvent() {
  window.addEventListener("storage", (ev) => {
    // console.log(ev);
  });
}

function keyMap() {
  const storageMap = new Map<any, Ref<any>>();

  return {
    set(key: any, value: any) {
      const data = storageMap.get(key);
      if (data.value === value) return;

      storageMap.set(key, data);

      return true;
    },

    has(key: any) {
      return storageMap.has(key);
    },

    remove(key: any) {
      storageMap.delete(key);
      return true;
    },
  };
}

onStorageEvent();

function setExpriedHashMap(key: string, expried: number) {
  const hashmap = localStorage.getItem(key);

  if (hashmap) {
    localStorage.setItem(
      "expriedhashmap",
      JSON.stringify({
        ...JSON.parse(hashmap),
        key: expried,
      })
    );
  } else {
    localStorage.setItem("expriedhashmap", JSON.stringify({ key: expried }));
  }
}

function getItem(key: string): undefined | boolean {
  const hashmap = localStorage.getItem("expriedhashmap");

  if (hashmap) {
    const map = JSON.parse(hashmap);
    if (Object.prototype.hasOwnProperty.call(map, key)) {
      return map[key] > Date.now() ? false : true;
    }
  }

  return undefined;
}

function setItme(key: string, expried: number) {
  return new Promise((resolve, reject) => {
    const now = Date.now();

    if (expried > now) {
      setExpriedHashMap(key, expried);
      resolve("");
    } else {
      reject("过期时间必须大于当前时间");
    }
  });
}

export function useStorage(
  key: string,
  value: any,
  mode: "local" | "sess",
  options: Options
): Ref<any> {
  const data = ref(value);

  const storeage = mode === "local" ? window.localStorage : window.sessionStorage;
  const { isGet } = options;

  if (isGet) {
    //是否过期
    const isExpried = getItem(key);

    if (isExpried) {
      storeage.removeItem(key);
      return undefined;
    } else {
      data.value = storeage.getItem(key);
      return data;
    }
  }

  if (Object.prototype.toString.call(value) === "[object Object]" && value?.expried) {
    setItme(key, value.expried)
      .then(() => {
        storeage.setItem(key, value.data);
      })
      .catch((err) => {
        throw new Error(err);
      });
  } else {
    storeage.setItem(key, value);
  }

  return data;
}
