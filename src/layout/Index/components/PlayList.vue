<template>
  <router-link :to="{ path: '/songdetail', query: { id: hotsong.id } }">
    <div
      @mouseleave="playerIcon = false"
      @mouseenter="playerIcon = true"
      class="z-10 relative"
    >
      <ElImage class="rounded-md" :src="hotsong.picUrl + '?param=320y320'">
      </ElImage>
      <div
        class="flex items-center justify-center rounded-md absolute top-0 left-0 w-full h-full z-10"
        style="background: #3031334d"
        v-if="playerIcon"
      >
        <FontIcon size="42" color="#fff" icon="iconbofang3"></FontIcon>
      </div>
    </div>
  </router-link>
  <div>
    <span
      class="text-xs"
      :class="multiTruncate && 'multi_truncate'"
      style="color: #303133"
    >
      {{ hotsong.name }}
    </span>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue";

import { RecPlayList } from "..";
import { ElImage } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const props = defineProps({
  hotsong: {
    type: Object as PropType<RecPlayList>,
    required: true,
  },
  multiTruncate: Boolean,
});

const playerIcon = ref(false);
</script>
<style scoped lang="scss">
@include multi-truncate;
</style>
