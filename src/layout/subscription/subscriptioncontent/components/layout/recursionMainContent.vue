<template>
  <section style="background-color: #f5f6fa" class="px-6 pt-4 w-full h-full">
    <main>
      <mainContentText
        :msg="addNewEventJson.msg"
        :actId="event.extJsonInfo.actId"
        :actIds="event.extJsonInfo.actIds ?? []"
      />
      <mainContentSong v-if="!!musicDetail" :music-detail="musicDetail" />
      <mainContentImageList
        :pics="event.pics ?? []"
        :isMarginTop="!!musicDetail"
        @click.capture="onEmitPreviewInfo"
      />
    </main>
    <footer>
      <mainContentFooter
        :likedCount="event.info.likedCount"
        :recursion="true"
        :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
        @linke="transferFn"
      />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed, defineEmit, getCurrentInstance } from "@vue/runtime-core";

import { musicResultDetail } from "../../../../../utils/musicDetail";
import { eventType } from "../../hooks/eventType";
import { onLinke } from "../../hooks/onLinke";

import mainContentImageList from "./mainContentImageList.vue";
import mainContentFooter from "./mainContentFooter.vue";
import mainContentSong from "./mainContentSong.vue";
import mainContentText from "./mainContentText.vue";

import type { Emitter } from "mitt";

const props = defineProps({
  event: {
    type: Object,
    default: () => { },
  },
});

const instance = getCurrentInstance()

const mitt: Emitter = instance.appContext.config.globalProperties["mittBus"]



const eventJson = computed(() => {
  const json = JSON.parse(props.event.json);

  return json;
});

const addNewEventJson = computed(() => {
  return {
    msg: `<a herf="jacascript:;;" data-id="${props.event.user.userId ?? props.event.user.uid
      }" style="color:#74b9ff" class="user hover_init cursor-pointer">@${props.event.user.nickname
      }</a>  ${eventType.value(props.event.type)}：${eventJson.value["msg"]}`,
  };
});

const musicDetail = musicResultDetail(eventJson.value["song"] ?? {});

function transferFn(...res: any) {
  onLinke(props.event, res[0], res[1] ? 0 : 1);
}

function onEmitPreviewInfo(e: PointerEvent) {
  const index = (e.target as HTMLElement).getAttribute("key-index");

  mitt.emit("preview", [JSON.parse(JSON.stringify(props.event.pics)), index])
}

</script>
<style scoped lang="scss">
</style>
