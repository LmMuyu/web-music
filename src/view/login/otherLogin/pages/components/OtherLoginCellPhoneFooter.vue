<template>
  <div class="icons flex items-center h-full cursor-pointer" @click="onOther">
    <i class="iconfont iconarrow-right-copy"></i>
    <a class="text-sm relative left-2" style="top: 2px">其他登录方式</a>
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance } from "@vue/runtime-core";

const mitt = getCurrentInstance()?.appContext.config.globalProperties.mitt;

function onOther() {
  mitt.emit("otherLogin", { comp: "otherLogin", type: "mitt" });
}
</script>
<style lang="scss" scoped>
.icons {
  @include Iconfont();
}
</style>
