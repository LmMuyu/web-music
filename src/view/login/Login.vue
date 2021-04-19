<template>
  <div
    class="select bg-white flex flex-col fixed left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 z-50 shadow"
    style="width: 530px; height: 372px"
    :ref="mouse"
  >
    <header class="bg-gray-900 py-3 flex" style="height: 12.499%">
      <div style="width: 50%" class="flex items-center">
        <p class="transform translate-x-2 text-white font-bold text-lg">
          {{ headerTitle }}
        </p>
      </div>
      <div style="width: 50%" class="icon flex items-center justify-end">
        <i
          class="iconfont icondel transform -translate-x-2"
          @click="cancel"
        ></i>
      </div>
    </header>
    <keep-alive>
      <component @onOther="onOther" :is="componentId"></component>
    </keep-alive>
  </div>
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  defineProps,
  getCurrentInstance,
  onBeforeUnmount,
  provide,
  ref,
  shallowRef,
} from "vue";
import { isType } from "../../utils/methods";
import mouse from "./api/mouse";
import { COMP } from "./enum";
import type { otherOptions } from "./type";
import type { Emitter } from "mitt";

const QrLogin = defineAsyncComponent(() => import("./qrLogin/QrLogin.vue"));
const otherLogin = defineAsyncComponent(
  () => import("./otherLogin/OtherLogin.vue")
);
const OtherLoginCellPhone = defineAsyncComponent(
  () => import("./otherLogin/pages/OtherLoginCellPhone.vue")
);

const props = defineProps({
  cancel: {
    type: Function,
    required: true,
  },
});

const mitt: Emitter = getCurrentInstance()?.appContext.config.globalProperties
  .mitt;
mitt.on("otherLogin", onOther);

const headerTitle = ref("登录");
const componentId = shallowRef(QrLogin);
const currCompId = shallowRef("qrlogin");
provide("currCompId", currCompId);
let istype: boolean = false; //mitt

function onOther(comp: string | otherOptions | undefined) {
  const type = isType(comp);
  if (!comp && type !== "Object") throw new Error("组件未传入!");

  if (type === "Object") {
    const { comp: compinstance, type }: otherOptions = comp as otherOptions;
    currCompId.value = comp = compinstance;
    istype = !!type;
  } else {
    currCompId.value = comp as string;
  }

  switch (comp) {
    case COMP.OTHERLOGIN:
      componentId.value = otherLogin;
      break;
    case COMP.QRLOGIN:
      componentId.value = QrLogin;
      break;
    case COMP.LOGINWITHPHONE:
      componentId.value = OtherLoginCellPhone;
      break;
    default:
      throw new Error("未找到组件");
  }
}

onBeforeUnmount(() => {
  if (istype) {
    mitt.off("otherLogin", onOther);
  }
});
</script>

<style scoped lang="scss">
.icon {
  @include Iconfont(#f5f6fa, 32);

  & > i {
    cursor: pointer;
  }
}

.shadow {
  box-shadow: 0px 0px 5px #2d3436;
}

.qrexpired {
  background-color: rgba(255, 255, 255, 0.616);
  z-index: 49;
}

.select {
  -webkit-touch-callout: none;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
</style>
