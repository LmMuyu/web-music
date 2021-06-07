import { defineAsyncComponent } from "@vue/runtime-core";

import Loading from "../components/loading/Loading.vue";

export function createAsComponent(src: string) {
  return defineAsyncComponent({
    // The factory function
    loader: () => import(src),
    loadingComponent: Loading,
    delay: 200,
    timeout: 3000,
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
