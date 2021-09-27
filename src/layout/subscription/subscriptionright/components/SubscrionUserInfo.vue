<template>
  <div class="flex flex-col py-6 bottom_solid">
    <div class="flex">
      <div class="px-4">
        <ElAvatar :size="60" />
      </div>
      <span>
        <p class="text-lg">看到卡</p>
      </span>
    </div>
    <div class="flex py-6">
      <p class="px-4 text-lg">动态：20</p>
      <p class="px-4 text-lg">关注：20</p>
      <p class="px-4 text-lg">订阅：20</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useStore } from "vuex";

import { ElAvatar } from "element-plus";
import { getUserDetail } from "../../../../api/subscription";

const store = useStore();

// getUserDetail().then((worker) => {
//   console.log(worker);
// });

const userInfo = store.getters["login/getUserInfo"];
</script>
<style scoped lang="scss">
.bottom_solid {
  border-bottom: 1px solid #dfe6e9;
}
</style>
