<template>
  <IndexModuleHeadTitle v-if="!donreferto" title="最近的专辑" />
  <div class="overflow-hidden h-full w-full betterscroll">
    <BetterScrollVue class="container">
      <CardExhibition
        v-for="(album, index) in donreferto ? outsidealbums : albums.slice(0, 4)"
        :key="index"
        :keyindex="index"
        :data="album"
      />
    </BetterScrollVue>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { recentlyAlbum } from "../../../api/index";
import BetterScrollVue from "../../../components/betterscroll/BetterScroll.vue";
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

.betterscroll {
  &:deep(.container) {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px 16px;
  }
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
