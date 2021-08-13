<template>
  <section
    style="background-color: #74b9ff;"
    class="flex justify-center items-center w-full h-full"
  >
    <main class="flex w-4/5 h-full bg-white shadow">
      <div class="w-1/2 h-full">
        <keep-alive>
          <component :is="componentId"></component>
        </keep-alive>
      </div>
      <div class="w-1/2 h-full relative">
        <LoginBanner />
      </div>
    </main>
  </section>
</template>
<script setup lang='ts'>
import { shallowRef } from "@vue/reactivity";

import { createAsComponent } from "../../utils/createAsComponent";

import LoginBanner from "./components/LoginBanner.vue"
const MobilePhone = createAsComponent(() => import("./loginWay/mobilePhone/MobilePhone.vue"))


const componentId = shallowRef(MobilePhone)
</script>

<style scoped lang='scss'>
.shadow {
  box-shadow: 0 0 9px #636;
}
.shadow {
  box-shadow: 0 0 9px #636e72;
}
</style>