<template>
  <el-container class="h-full relative section_container min_w_h">
    <el-main class="backdrop padd">
      <PlayListMain
        :singerName="playListMainInfo.nickName"
        :musicName="playListMainInfo.musicName"
        :backgroundurl="playListMainInfo.backgroundurl"
      ></PlayListMain>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { computed, reactive, watchEffect } from "vue";
import { useStore } from "vuex";

import PlayListMain from "./components/PlayListMain.vue";
import { ElContainer, ElMain } from "element-plus";
import { musicDetail } from "../../utils/musicDetail";

const store = useStore();

const playListMainInfo = reactive({
  musicName: "",
  nickName: "",
  backgroundurl: "",
});

const songInfo = computed<musicDetail>(store.getters["playlist/getSongInfo"]);

store.commit("setControlAudioCompIf", false);

watchEffect(() => {
  if (Object.keys(songInfo.value).length > 0) {
    playListMainInfo.backgroundurl = songInfo.value.picUrl;
    playListMainInfo.nickName = songInfo.value.nickName;
    playListMainInfo.musicName = songInfo.value.name;
  }
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
