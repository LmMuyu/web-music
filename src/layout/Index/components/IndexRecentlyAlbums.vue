<template>
  <IndexModuleHeadTitle v-if="!donreferto" title="最近的专辑" />
  <div :class="donreferto && 'h-full'" class="overflow-hidden w-full betterscroll">
    <better-scroll v-if="donreferto" :open-h-render="!donreferto" :item-len="Infinity">
      <div class="grid grid-cols-4">
        <card-exhibition
          v-for="(album, index) in outsidealbums"
          :key="index"
          :keyindex="index"
          :data="album"
          class="pt-4"
        />
      </div>
    </better-scroll>
    <div class="flex" v-else>
      <card-exhibition
        v-for="(album, index) in albums.slice(0, 4)"
        :key="index"
        :keyindex="index"
        :data="album"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { recentlyAlbum } from "../../../api/index";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import CardExhibition from "../../../components/cardexhibition/CardExhibition.vue";

import IndexModuleHeadTitle from "./IndexModuleHeadTitle.vue";

const props = defineProps({
  donreferto: Boolean,
  outsidealbums: {
    type: Array,
    default: () => [],
  },
});

const albums = ref<any[]>([]);

watchEffect(async () => {
  if (!props.donreferto) {
    albums.value = (await recentlyAlbum()).data.albums;
  } else {
    albums.value = props.outsidealbums;
  }
});
</script>
<style scoped lang="scss">
.fide-enter-active,
.fide-leave-active {
  transition: all 0.25s;
}

.fide-enter-from,
.fide-leave-to {
  opacity: 0;
}

.clapm {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-wrap: normal;
}
</style>
