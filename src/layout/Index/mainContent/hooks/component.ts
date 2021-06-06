import { shallowRef } from "@vue/reactivity";
import { defineAsyncComponent } from "@vue/runtime-core";

const Toplist = defineAsyncComponent(
  () => import("/layout/Index/toplist/Toplist.vue")
);

export const componentId = shallowRef(Toplist);
