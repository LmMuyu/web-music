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
import { ref, unref, watch } from "vue";

import { sendContentComment } from "../../../../../api/app";
import { VideoComments } from "../../../../../components/player";

import CommtentContainer from "./CommtentContainer.vue";

import type { SendContent } from "../type";
import { closeInputEditorMitt } from "../../../hooks/methods";

const props = defineProps({
  mid: {
    type: Number,
    required: true,
  },
});

const total = ref(1);
const shut = ref(true);
const commentsData = ref([]);

const VideoCommentModule = new VideoComments("music");

watch(VideoCommentModule.comments, (newvaluelists) => {
  total.value = newvaluelists.length;
  commentsData.value = newvaluelists;
});

VideoCommentModule.currentMusicPlayIndex(1, props.mid);

async function sendContent(content: SendContent) {
  console.log(content);
  const reply = content.reply;
  closeInputEditorMitt.emit(true);

  try {
    const editor = await sendContentComment(
      !unref(reply) ? 1 : 2,
      "歌曲",
      {
        id: props.mid,
        ...(Object.keys(unref(content.replyInfo)).length > 0
          ? { commentId: unref(content.replyInfo).commentId }
          : {}),
      },
      content.content
    );
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
