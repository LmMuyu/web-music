<template>
  <el-container class="bg-white h-full">
    <el-header height="100px">
      <div class="font-bold text-lg py-4">设置</div>
      <setting-header />
    </el-header>
    <el-main>
      <better-scroll :open-h-render="false">
        <SettingAccount ref="accout" />
      </better-scroll>
    </el-main>
    <div v-if="routerViewClass" class="absolute left-0 top-0 w-full h-full bg-white">
      <router-view></router-view>
    </div>
  </el-container>
</template>
<script setup lang="ts">
import { ref, watchEffect, onActivated, onDeactivated } from "vue";

import { useWatchRoutePath } from "../../utils/useWatchHost";

import { ElContainer, ElMain, ElHeader } from "element-plus";
import BetterScroll from "../../components/betterscroll/BetterScroll.vue";
import SettingAccount from "./components/SettingAccount.vue";
import SettingHeader from "./components/SettingHeader.vue";

const routerViewClass = ref(false);

class container {
  val: any;
  constructor(val: any) {
    this.val = val;
  }

  map(f) {
    return new container(f(this.val));
  }

  static of(val: any) {
    return new container(val);
  }
}

const nodeRefList = container.of([]);

function nodeRef() {
  return nodeRefList.map((val) => {
    const nref = ref(null);
    val.push(nref);
    return nref;
  }).val;
}

const watchRoute = useWatchRoutePath();

const watchEffectContainer = () =>
  watchEffect(() => {
    if (watchRoute.value.path === "/setting") {
      routerViewClass.value = false;
    } else {
      const absoluteLists = ["/setting/binding"];
      if (absoluteLists.indexOf(watchRoute.value.path) > -1) {
        routerViewClass.value = true;
      }
    }

    console.log(routerViewClass.value);
  });
let watchEffectStop = null;

const accout = nodeRef();

onActivated(() => {
  watchEffectStop = watchEffectContainer();
});

onDeactivated(() => {
  watchEffectStop();
  watchEffectStop = null;
});
</script>
<style scoped lang="scss"></style>
