import { defineAsyncComponent } from "@vue/runtime-core";

import Loading from "../components/loading/Loading.vue";

import type { AsyncComponentLoader } from "vue";

interface createAsComponentOptions {
  timeout?: number;
  loadComp: boolean;
}

export function createAsComponent(
  src: AsyncComponentLoader<any>,
  options: createAsComponentOptions = {
    loadComp: true,
  }
) {
  return defineAsyncComponent({
    loader: src,
    delay: 200,
    ...(options.loadComp ? { loadingComponent: Loading } : {}),
    timeout: options.timeout || 10000,
    suspensible: false,
    onError(error, retry, fail, attempts) {
      if (error.message.match(/fetch/) && attempts <= 3) {
        console.log(error);
        retry();
      } else {
        console.log(error);
        fail();
      }
    },
  });
}
