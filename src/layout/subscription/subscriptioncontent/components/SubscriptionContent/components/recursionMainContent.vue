<template>
  <section
    style="background-color: #f5f6fa; transform: scale(0.92)"
    class="p-6"
  >
    <!-- <header>
      <mainContentHeader :type="event.type" :userinfo="event.user" />
    </header> -->
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
      />
    </main>
    <footer>
      <mainContentFooter
        :likedCount="event.info.likedCount"
        :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
      />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";

import { musicResultDetail } from "../../../../../../utils/musicDetail";
import { eventType } from "../../../hooks/eventType";

import mainContentImageList from "./mainContentImageList.vue";
// import mainContentHeader from "./mainContentHeader.vue";
import mainContentFooter from "./mainContentFooter.vue";
import mainContentSong from "./mainContentSong.vue";
import mainContentText from "./mainContentText.vue";

const props = defineProps({
  event: {
    type: Object,
    default: () => {},
  },
});

const eventJson = computed(() => {
  const json = JSON.parse(props.event.json);
  // console.log(json);

  return json;
});

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
</script>
<style scoped lang="scss"></style>
