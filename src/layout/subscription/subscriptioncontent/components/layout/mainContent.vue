<template>
  <section>
    <header>
      <MainContentHeader :type="event.type" :userinfo="event.user" />
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
        @linke="transferFn"
      />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed, defineEmits } from "@vue/runtime-core";

import { musicResultDetail } from "../../../../../utils/musicDetail";
import { onLinke } from "../../hooks/onLinke";

import MainContentImageList from "./MainContentImageList.vue";
import RecursionMainContent from "./RecursionMainContent.vue";
import MainContentHeader from "./MainContentHeader.vue";
import MainContentFooter from "./MainContentFooter.vue";
import MainContentSong from "./MainContentSong.vue";
import MainContentText from "./MainContentText.vue";

const ctxEmit = defineEmits(["emitPics"]);

const props = defineProps({
  event: {
    type: Object,
    default: () => { },
  },
});

const eventJson = computed(() => {
  const json = JSON.parse(props.event.json);
  return json;
});

const isNum = (num: number) => num === 0 ? "" : num

const footerInfo = computed(() => {
  return [
    {
      event: {
        emit: true,
        emit_name: "linke"
      },
      icon: ['icondianzan1', 'iconzan'],
      count: isNum(props.event.info.likedCount)//点赞
    },
    {
      count: isNum(props.event.info.commentCount),//评论
    },
    {
      count: isNum(props.event.insiteForwardCount),//转发
    }
  ]
})

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



