<template>
  <section class="betterscroll w-full px-6">
    <div v-for="(linke, index) in linkeLists.slice(0, 12)" :key="index" class="flex items-center">
      <div
        class="relative"
        @click="playMusic(linke)"
        @mouseenter="playiconIndex = index"
        @mouseleave="playiconIndex = null"
      >
        <ElImage
          :src="linke.picUrl + '?param=128y128'"
          fit="cover"
          @load="imgload"
          style="width: 36px; height: 36px; border-radius: 4px; visibility: hidden"
        />
        <div
          style="background-color: rgb(0, 0, 0, 0.2)"
          class="flex items-center justify-center absolute top-0 left-0 w-full z-10 h_height"
          v-if="playiconIndex === index"
        >
          <font-icon icon="iconbofang2" color="#fff" size="26"></font-icon>
        </div>
      </div>
      <div class="flex flex-col px-4">
        <span class="font-bold truncate">{{ linke.name }} </span>
        <span v-html="linke.nickName" style="color: #606266" class="text-xs"> </span>
      </div>
    </div>
  </section>
</template>
<script setup lang="tsx">
import { PropType, ref } from "vue";

import { ElImage } from "element-plus";
import FontIcon from "../../../../components/fonticon/FontIcon.vue";

import type { musicDetail } from "../../../../utils/musicDetail";
import { useStore } from "vuex";

const props = defineProps({
  linkeLists: {
    type: Array as PropType<musicDetail[]>,
    required: true,
  },
});

const store = useStore();
const playiconIndex = ref(null);

function imgload(ev: Event) {
  (ev.target as HTMLElement).style.visibility = "visible";
}

function playMusic(linke: musicDetail) {
  store.commit("playlist/setSongId", linke.id);
}
</script>
<style scoped lang="scss">
.betterscroll {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
.h_height {
  height: calc(100% - 4px);
}
</style>
