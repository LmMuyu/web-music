<template>
  <HeadTitle title="热门歌单" />
  <div class="grid grid-cols-3 gap-7">
    <div
      v-for="(hotmusiclist, index) in playList"
      class="flex flex-col relative w-28 rounded-md"
      :key="index"
    >
      <PlayList :multi-truncate="true" :hotsong="hotmusiclist" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";

import HeadTitle from "./IndexModuleHeadTitle.vue";
import PlayList from "./PlayList.vue";

const props = defineProps({
  playList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});
</script>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
