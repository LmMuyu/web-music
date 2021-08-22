<template>
  <section>
    <header>
      <MainContentHeader :type="event.type" :userinfo="event.user" :show-time="event.showTime" />
    </header>
    <main class="py-6">
      <MainContentText
        :msg="eventJson.msg ?? ''"
        :actId="event.extJsonInfo.actId"
        :actIds="event.extJsonInfo.actIds ?? []"
      />
      <MainContentSong v-if="!!musicDetail" :music-detail="musicDetail" />
      <MainContentImageList
        :pics="event.pics ?? []"
        :isMarginTop="!!musicDetail"
        @click.capture="onEmitPreviewInfo"
      />
    </main>
    <main v-if="!!eventJson.event">
      <RecursionMainContent :event="eventJson.event" />
    </main>
    <footer>
      <MainContentFooter
        :info="footerInfo"
        :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
        @linke="linke"
        @comment="comment"
      />
      <article>
        <MainWriteBox />
        <MainComment :comments="commentList" />
      </article>
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed, defineEmits, ref, unref } from "@vue/runtime-core";

import { musicResultDetail } from "../../../../../utils/musicDetail";
import { getComment } from "../../../../../api/subscription";
import { computed_footerInfo } from "../methods";
import { onLinke } from "../../hooks/onLinke";

import MainContentImageList from "./MainContentImageList.vue";
import RecursionMainContent from "./RecursionMainContent.vue";
import MainContentHeader from "./MainContentHeader.vue";
import MainContentFooter from "./MainContentFooter.vue";
import MainContentSong from "./MainContentSong.vue";
import MainContentText from "./MainContentText.vue";
import MainWriteBox from "./MainWriteBox.vue"
import MainComment from "./MainComments"

const ctxEmit = defineEmits(["emitPics"]);

const props = defineProps({
  event: {
    type: Object,
    default: () => { },
  },
});

const footerInfo = unref(computed_footerInfo)(props)
const commentList = ref([])

function linke(...emits: any) {
  onLinke(props.event, emits[0], emits[1] ? 0 : 1)
};

async function comment() {
  const result = await getComment(props.event.info.threadId)
  commentList.value = result.data.comments
}

function onEmitPreviewInfo(e: PointerEvent) {
  const index = (e.target as HTMLElement).getAttribute("key-index");

  ctxEmit("emitPics", [JSON.parse(JSON.stringify(props.event.pics)), index]);
}


const eventJson = computed(() => {
  const json = JSON.parse(props.event.json);
  return json;
});

const musicDetail = musicResultDetail(eventJson.value["song"] ?? {});
</script>
<style scoped lang="scss">
</style>




