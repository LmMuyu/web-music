<template>
  <div class="absolute top-7 left-0 w-28 z-10" style="background: #333333">
    <div class="triangle absolute"></div>
    <ul class="list-none">
      <li
        v-for="(model, index) in userModule"
        :key="index"
        class="icons text-white flex p-4"
      >
        <a href="">
          <el-badge :value="444">
            <i class="iconfont" :class="model.icon"></i>
            <p class="text-base">{{ model.moduleText }}</p>
          </el-badge>
        </a>
      </li>
    </ul>
  </div>
</template>
<script setup lang='ts'>
import { userModule } from "../hooks/data";
import { ElBadge } from "element-plus";

</script>
<style scoped lang='scss'>
.icons {
  @include Iconfont(#fff);
}

.triangle {
  width: 0;
  height: 0;
  border: 10px solid;
  border-color: transparent transparent #333 transparent;
  top: -20px;
  left: calc(50% - 10px);
}
</style> 