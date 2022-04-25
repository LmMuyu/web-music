<template>
  <section
    :style="{ backgroundColor: props.recursion ? '#f5f6fa' : '#fff' }"
    :class="recursion && 'px-6 pt-4 w-full h-full'"
  >
    <header v-if="!recursion">
      <MainContentHeader :type="event.type" :userinfo="event.user" :showTime="event.showTime" />
    </header>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, unref } from "@vue/runtime-core";

import { musicResultDetail } from "../../../utils/musicDetail";
import { useRefNegate } from "../../../utils/useRefNegate";
import preview from "../../../components/previewpicture";
import { getComment } from "../../../api/subscription";
import { eventType } from "../hooks/eventType";
import { computed_footerInfo } from "../methods";
import { onLinke } from "../hooks/onLinke";

import MainContentImageList from "./MainContentImageList.vue";
import MainContentHeader from "./MainContentHeader.vue";
import MainContentFooter from "./MainContentFooter.vue";
import MainContentSong from "./MainContentSong.vue";
import MainContentText from "./MainContentText.vue";
import MainWriteBox from "./MainWriteBox.vue";
import MainContent from "./MainContent.vue";
import MainComment from "./MainComments";
import { isRef } from "vue";

// <main class="py-6">
//       <!-- musicResultDetail(eventJson.value["song"] ?? {}) -->
//       <div v-if="musicDetail"><MainContentSong :musicDetail="musicDetail" />}</div>
//       <div>
//         <MainContentImageList
//           :pics="event.pics ?? []"
//           :isMarginTop="musicDetail"
//           @preImage="previewComp"
//         />
//       </div>
//     </main>
//     <main v-if="!!eventJson.event">
//       <MainContent :event="eventJson.event" />
//     </main>
//     <footer>
//       <MainContentFooter
//         :info="footerInfo"
//         :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
//         @linke="linke"
//         @comment="comment"
//       />
//       <article v-if="!recursion && countRef.value">
//         <MainWriteBox @sendComment="sendComment" />
//         <MainComment :comments="commentList" />
//       </article>
//     </footer>

const ctxEmit = defineEmits(["retPics"]);

const props = defineProps({
  event: {
    type: Object,
    default: () => {},
  },
  recursion: {
    type: Boolean,
    default: false,
  },
});

const footerInfo = unref(computed_footerInfo)(props);
const { countRef, negate } = useRefNegate(false);
const commentList = ref([]);
const musicDetail = "";

function linke(...emits: any) {
  onLinke(props.event, emits[0], emits[1] ? 0 : 1);
}

async function comment() {
  if (countRef.value || commentList.value.length > 0) return negate();

  const result = await getComment(props.event.info.threadId);
  commentList.value = result.data.comments;

  negate();
}

function previewComp(preindex: number) {
  const pics = props.event.pics;

  const previewcomp = new preview(pics, preindex);
}

const eventJson = computed(() => {
  const json = JSON.parse(props.event["json"]);
  return json;
});

const newEventJson = computed(() => {
  return props.recursion
    ? {
        msg: `<a herf="jacascript:;;" data-id="${
          props.event.user.userId ?? props.event.user.uid
        }" style="color:#74b9ff" class="user hover_init cursor-pointer">@${
          props.event.user.nickname
        }</a>  ${eventType.value(props.event.type)}：${eventJson.value["msg"]}`,
      }
    : {};
});
</script>

<style scoped lang="scss"></style>
