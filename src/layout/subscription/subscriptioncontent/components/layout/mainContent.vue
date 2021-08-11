<template>
  <section>
    <header>
      <mainContentHeader :type="event.type" :userinfo="event.user" />
    </header>
    <main class="py-6">
      <mainContentText
        :msg="eventJson.msg ?? ''"
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
    <main v-if="!!eventJson.event">
      <recursionMainContent :event="eventJson.event" />
    </main>
    <footer>
      <mainContentFooter
        :likedCount="event.info.likedCount"
        :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
        @linke="transferFn"
      />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed, defineEmit } from "@vue/runtime-core";

import { musicResultDetail } from "../../../../../utils/musicDetail";
import { onLinke } from "../../hooks/onLinke";

import mainContentImageList from "./mainContentImageList.vue";
import recursionMainContent from "./recursionMainContent.vue";
import mainContentHeader from "./mainContentHeader.vue";
import mainContentFooter from "./mainContentFooter.vue";
import mainContentSong from "./mainContentSong.vue";
import mainContentText from "./mainContentText.vue";

const ctxEmit = defineEmit(["emitPics"]);

const props = defineProps({
  event: {
    type: Object,
    default: () => { },
  },
});

const eventJson = computed(() => {
  const json = JSON.parse(props.event.json);
  // console.log(json);

  return json;
});

const musicDetail = musicResultDetail(eventJson.value["song"] ?? {});

function transferFn(...res: any) {
  onLinke(props.event, res[0], res[1] ? 0 : 1);
}

function onEmitPreviewInfo(e: PointerEvent) {
  const index = (e.target as HTMLElement).getAttribute("key-index");


  ctxEmit("emitPics", [JSON.parse(JSON.stringify(props.event.pics)), index]);
}
</script>
<style scoped lang="scss">
</style>
