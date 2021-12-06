<template>
  <div style="background-color: #eaeaea" class="flex justify-center items-center w-full h-full">
    <keep-alive>
      <component :is="componentId"></component>
    </keep-alive>
  </div>
</template>
<script setup lang="ts">
import { shallowRef } from "@vue/reactivity";

import { createAsComponent } from "../../utils/createAsComponent";

const MobilePhone = createAsComponent(() => import("./loginWay/mobilePhone/MobilePhone.vue"));

const componentId = shallowRef(MobilePhone);
</script>

<style scoped lang="scss">
.shadow {
  box-shadow: 0 0 9px #636;
}
.shadow {
  box-shadow: 0 0 9px #636e72;
}
</style>
