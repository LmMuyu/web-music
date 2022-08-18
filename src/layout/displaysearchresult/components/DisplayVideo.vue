<template>
  <BetterScroll :open-h-render="false">
    <card-row class="flex justify-center" :col-item="4" :playlist="data">
      <template #default="{ custom }">
        <VideoBox titleclass="text-sm" :videoinfo="custom.playitem" :index="0"></VideoBox>
      </template>
    </card-row>
    <slot></slot>
  </BetterScroll>
</template>
<script setup lang="ts">
import { videoDetail } from "../../video/hooks/data";

import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import VideoBox from "../../../components/videobox/VideoBox.vue";
import CardRow from "../../../components/card/CardRow.vue";

import type { PropType } from "vue";

const props = defineProps({
  data: {
    type: Array as PropType<videoDetail[]>,
    default: () => [],
  },
});
</script>
<style scoped lang="scss"></style>
