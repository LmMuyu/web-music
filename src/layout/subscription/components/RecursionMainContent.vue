<template>
  <section>
    <main>
      <MainContentText
        :msg="addNewEventJson.msg"
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
    <footer>
      <MainContentFooter
        :info="footerInfo"
        :recursion="true"
        :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
        @linke="transferFn"
      />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed, getCurrentInstance, unref } from "@vue/runtime-core";

import { musicResultDetail } from "../../../utils/musicDetail";
import { eventType } from "../hooks/eventType";
import { computed_footerInfo } from "../methods";
import { onLinke } from "../hooks/onLinke";

import MainContentImageList from "./MainContentImageList.vue";
import MainContentFooter from "./MainContentFooter.vue";
import MainContentSong from "./MainContentSong.vue";
import MainContentText from "./MainContentText.vue";

import type { Emitter } from "mitt";

const props = defineProps({
  event: {
    type: Object,
    default: () => {},
  },
});

const instance = getCurrentInstance();

const mitt: Emitter = instance.appContext.config.globalProperties["mittBus"];

const eventJson = computed(() => {
  const json = JSON.parse(props.event.json);
  return json;
});

const footerInfo = unref(computed_footerInfo)(props);

const addNewEventJson = computed(() => {
  return {
    msg: `<a herf="jacascript:;;" data-id="${
      props.event.user.userId ?? props.event.user.uid
    }" style="color:#74b9ff" class="user hover_init cursor-pointer">@${
      props.event.user.nickname
    }</a>  ${eventType.value(props.event.type)}：${eventJson.value["msg"]}`,
  };
});

const musicDetail = musicResultDetail(eventJson.value["song"] ?? {});

function transferFn(...res: any) {
  onLinke(props.event, res[0], res[1] ? 0 : 1);
}

function onEmitPreviewInfo(e: PointerEvent) {
  const index = (e.target as HTMLElement).getAttribute("key-index");

  mitt.emit("preview", [JSON.parse(JSON.stringify(props.event.pics)), index]);
}
</script>
<style scoped lang="scss"></style>
