<template>
  <el-container class="h-full relative section_container">
    <el-main class="backdrop padd">
      <!-- <PlayListMain
        :singerName="singer"
        :musicInfo="musicDetailInfo"
        :musicName="unref(musicInfo)?.name"
      ></PlayListMain>-->
    </el-main>
    <el-footer style="z-index:1" class="flex items-center bg-white padd">
      <Audio></Audio>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">

import { ElContainer, ElMain, ElFooter } from "element-plus";
import Audio from "../../components/player/Audio.vue";
import PlayListMain from "./components/PlayListMain.vue";
</script>

<style scoped lang="scss">
@include Iconfont(#2c3e50, 24);

@mixin position {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.padd {
  padding: 0 !important;
}

.filter {
  filter: blur(20px);
}

.bgcolor {
  @include position();
  background-color: #2d3436;
  opacity: 0.5;
  z-index: -1;
}
</style>
