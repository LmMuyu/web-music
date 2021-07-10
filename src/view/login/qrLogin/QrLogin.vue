<template>
  <article class="flex justify-center items-center h-3/4">
    <div class="w-52 flex flex-col" style="height: 245.55px">
      <p class="text-center text-2xl">扫码登录</p>
      <div class="w-52 h-52 relative">
        <img :src="qrBase64" class="h-full w-full" draggable="false" />
        <Expired @click="onQrLogin" :qrexpired="qrexpired" />
      </div>
    </div>
  </article>
  <footer style="height: 12.499%" class="flex items-center justify-center">
    <ElButton round @click="ctxEmit('onOther', 'otherLogin')"
      >选择其它方式登录</ElButton
    >
  </footer>
</template>
<script setup lang="ts">
import {
  defineAsyncComponent,
  defineEmit,
  getCurrentInstance,
  onBeforeUnmount,
  watch,
} from "@vue/runtime-dom";

const Expired = defineAsyncComponent(() => import("../components/Expired.vue"));
import { ElButton } from "element-plus";

import observer from "../../../utils/observer/Observer";
import { touchQrLogin } from "./methods";

const ctxEmit = defineEmit(["onOther"]);

const currentInstanceName =
  getCurrentInstance()?.type.__file?.match(/(\w+)\.vue$/)?.[1]!;

onBeforeUnmount(() => {
  observer.off(currentInstanceName);
});

const onQrLogin = () => touchQrLogin(currentInstanceName);

const { qrBase64, qrexpired } = touchQrLogin(currentInstanceName);

watch(qrBase64, (value) => {
  console.log(value);
});
</script>
<style lang="scss" scoped></style>
