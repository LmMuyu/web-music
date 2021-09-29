<template>
  <div class="flex h-full">
    <el-container v-if="shieldContainer(left?.subject)" class="w-2/3">
      <el-main v-if="shieldContainer(left?.center)" class="h-full track_bar">
        <router-view name="section" v-slot="{ Component }">
          <keep-alive> <component :is="Component"></component> </keep-alive>
        </router-view>
      </el-main>
    </el-container>
    <el-container
      class="w-1/3 border-l border-solid"
      v-if="shieldContainer(right?.subject)"
    >
      <el-main
        v-if="shieldContainer(right?.center)"
        class="text w-full track_bar"
      >
        <router-view name="article" v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"></component>
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { computed, onActivated } from "@vue/runtime-core";
import { useRoute } from "vue-router";

import { componentId, compsId, runLoadView } from "./hooks/component";

import { ElContainer, ElHeader, ElMain } from "element-plus";
// import Search from "../search/Search.vue";

import type { META } from "../../routes/type/type";

const router = useRoute();
console.log(router);
const meta: META = router.meta;

// const defaultView = meta.defaultView;
const { left, right } = meta?.setting || { left: {}, right: {} };

// onActivated(() => {
//   runLoadView(defaultView);
// });

const returnresdata = (any: any) => {
  console.log(any);
};

const shieldContainer = computed(() => {
  return function (state: boolean) {
    return state + "" === "false" ? state : true;
  };
});
</script>

<!-- <Search
          class="w-4/5 h-2/3 border border-gray-500 border-solid rounded-2xl"
          input-class="w-full"
          :returnresdata="returnresdata"
        /> -->
<style scoped lang="scss">
.track_bar::-webkit-scrollbar {
  display: none;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: ""; /*不用有内容也可以*/
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}
</style>
