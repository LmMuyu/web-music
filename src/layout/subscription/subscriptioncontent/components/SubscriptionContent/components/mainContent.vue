<template>
  <section>
    <header>
      <mainContentHeader :type="event.type" :userinfo="event.user" />
    </header>
    <main class="py-6">
      <mainContentText :eventJson="eventJson" />
      <mainContentSong v-if="!!musicDetail" :music-detail="musicDetail" />
      <mainContentImageList
        :pics="event.pics ?? []"
        :isMarginTop="!!musicDetail"
      />
    </main>
    <footer>
      <div v-html="`<a href='/activity' >4444</a>`"></div>
      <mainContentFooter :likedCount="event.info.likedCount" />
    </footer>
  </section>
</template>
<script setup lang="ts">
import { computed } from "@vue/runtime-core";

import { musicResultDetail } from "../../../../../../utils/musicDetail";

import mainContentImageList from "./mainContentImageList.vue";
import mainContentHeader from "./mainContentHeader.vue";
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

const musicDetail = musicResultDetail(eventJson.value["song"] ?? {});
</script>
<style scoped lang="scss"></style>
