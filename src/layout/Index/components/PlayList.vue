<template>
  <router-link :to="{ path: '/songdetail', query: { id: hotsong.id } }">
    <div @mouseleave="playerIcon = false" @mouseenter="playerIcon = true" class="z-10">
      <ElImage class="rounded-md relative" :src="hotsong.picUrl + '?param=320y320'">
        <div
          class="flex items-center justify-center rounded-md absolute top-0 left-0 w-full h-full z-10"
          style="background: #3031334d"
          v-if="playerIcon"
        >
          <FontIcon size="42" color="#fff" icon="iconbofang3"></FontIcon>
        </div>
      </ElImage>
    </div>
  </router-link>
  <div>
    <span class="text-xs" style="color: #303133"> {{ hotsong.name }} </span>
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
});

const playerIcon = ref(false);
</script>
<style scoped lang="scss"></style>
