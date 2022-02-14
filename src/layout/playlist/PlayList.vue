<template>
  <el-container class="h-full relative section_container min_w_h">
    <el-main class="backdrop padd">
      <PlayListMain
        :singerName="playListMainInfo.nickName"
        :musicName="playListMainInfo.musicName"
        :backgroundurl="playListMainInfo.backgroundurl"
      ></PlayListMain>
    </el-main>
    <el-footer class="flex items-center bg-white padd">
      <Audio ref="compAudio"></Audio>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

import Audio from "../../components/player/Audio.vue";
import PlayListMain from "./components/PlayListMain.vue";
import { ElContainer, ElMain, ElFooter } from "element-plus";

const compAudio = ref<any>(null);
const playListMainInfo = reactive({
  musicName: "",
  nickName: "",
  backgroundurl: "",
});

onMounted(() => {
  // let timer = setInterval(() => {
  //   const musicdateil = compAudio.value.musicinfo;
  //   if (musicdateil !== undefined) {
  //     playListMainInfo.musicName = musicdateil.name;
  //     playListMainInfo.nickName = musicdateil.nickName;
  //     playListMainInfo.backgroundurl = musicdateil.picUrl;
  //     clearInterval(timer);
  //     timer = null;
  //   } else {
  //     console.error("musicdateil为undefined");
  //   }
  // }, 1000);
});
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

.min_w_h {
  min-height: 100vh;
  max-width: 100vw;
}
</style>
