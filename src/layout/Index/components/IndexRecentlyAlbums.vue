<template>
  <IndexModuleHeadTitle title="最近的专辑" />
  <div class="flex">
    <div
      v-for="(album, index) in albums.slice(0, 4)"
      :key="index"
      :class="[margin_right(index + 1), activeIndex === index && 'bg-white']"
      class="relative cursor-context-menu"
      @mouseenter.stop="() => active(index)"
      @mouseleave.stop="() => leave()"
    >
      <div class="w-56 h-44 bg-black">
        <img
          :src="album.picUrl + `?param=${224}y${176}`"
          :alt="album.commentThreadId"
          class="object-cover w-full h-full"
        />
      </div>
      <div class="flex flex-col p-8">
        <span class="text-lg" style="color: #545499">{{ album.name }}</span>
        <span class="text-sm" style="color: #7474ad"> {{ album.size }}张专辑 </span>
      </div>
      <Transition name="fide">
        <div class="absolute top-36 left-40" v-show="activeIndex === index">
          <IndexPlayIcon />
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { recentlyAlbum } from "../../../api/index";
import { margin_right } from "../hook";

import IndexModuleHeadTitle from "./IndexModuleHeadTitle.vue";
import IndexPlayIcon from "./IndexPlayIcon.vue";

const albums = ref([]);
const activeIndex = ref(null);

function active(index: number) {
  activeIndex.value = index;
}
function leave() {
  activeIndex.value = null;
}

albums.value = (await recentlyAlbum()).data.albums;
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
</style>
