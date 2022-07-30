<template>
  <commtent-container
    :on="{
      'current-change': VideoCommentModule.currentChange.bind(VideoCommentModule),
      'next-click': VideoCommentModule.changePageIndex.bind(VideoCommentModule),
      'prev-click': VideoCommentModule.changePageIndex.bind(VideoCommentModule),
      'send-content': sendContent,
    }"
    :data="commentsData"
    :size="VideoCommentModule.MAX_LIMIT"
    :total="VideoCommentModule.playListHistoryOptions.total"
    :render-b-s="false"
    :shut-dialog="shut"
    :paginationbackground="false"
    comp-id="Comment"
  />
</template>
<script setup lang="ts">
import { ref, watch } from "vue";

import { sendContentComment } from "../../../../../api/app";
import { VideoComments } from "../../../../../components/player";

import CommtentContainer from "./CommtentContainer.vue";

const props = defineProps({
  mid: {
    type: Number,
    required: true,
  },
});

const total = ref(1);
const commentsData = ref([]);
const shut = ref(true);

const VideoCommentModule = new VideoComments("music");

watch(VideoCommentModule.comments, (newvaluelists) => {
  total.value = newvaluelists.length;
  commentsData.value = newvaluelists;
});

VideoCommentModule.currentMusicPlayIndex(1, props.mid);

async function sendContent(content: string) {
  try {
    const editor = await sendContentComment(1, "歌曲", { id: props.mid }, content);
    if (editor.data.code === 200) {
      shut.value = false;
    }
  } catch (error) {
    console.log(error);
  } finally {
    shut.value = true;
  }
}
</script>
<style scoped lang="scss"></style>
