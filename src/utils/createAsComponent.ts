import { defineAsyncComponent } from "@vue/runtime-core";

import Loading from "../components/loading/Loading.vue";

interface createAsComponentOptions {
  timeout?: number;
  loadComp: boolean;
}

export function createAsComponent(
  src: string,
  options: createAsComponentOptions = {
    loadComp: true,
  }
) {
  return defineAsyncComponent({
    loader: () => import(src),
    ...(options.loadComp ? { loadingComponent: Loading } : {}),
    delay: 200,
    timeout: options.timeout || 10000,
    suspensible: false,
    onError(error, retry, fail, attempts) {
      if (error.message.match(/fetch/) && attempts <= 3) {
        retry();
      } else {
        fail();
      }
    },
  });
}