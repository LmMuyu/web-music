<template>
  <commtent-container
    :on="{
      'current-change': VideoCommentModule.currentChange.bind(VideoCommentModule),
      'next-click': VideoCommentModule.changePageIndex.bind(VideoCommentModule),
      'prev-click': VideoCommentModule.changePageIndex.bind(VideoCommentModule),
    }"
    :data="VideoCommentModule.comments"
    :size="VideoCommentModule.MAX_LIMIT"
    :total="VideoCommentModule.playListHistoryOptions.total"
    :render-b-s="false"
    comp-id="Comment"
  />;
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

import { VideoComments } from "../../../../../components/player";
import CommtentContainer from "./CommtentContainer.vue";

const props = defineProps({
  mid: {
    type: Number,
    required: true,
  },
});

const total = ref(1);

const VideoCommentModule = new VideoComments("music");

watch(VideoCommentModule.comments, (newvaluelists) => (total.value = newvaluelists.length));

VideoCommentModule.currentMusicPlayIndex(1, props.mid);
</script>
<style scoped lang="scss"></style>
