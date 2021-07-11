<template>
  <ul ref="listsong">
    <div
      class="flex justify-center flex-wrap"
      v-if="loadingMountAttribute.countRef"
    >
      <li
        v-for="(play, index) in playlist"
        :key="play.id"
        style="width: 25%"
        class="root_image_item flex justify-center overflow-hidden my-4"
      >
        <section
          class="relative w-full h-full text-center cneter"
          @mouseenter="mouseenter(index)"
          @mouseleave="negate"
        >
          <div>
            <img
              :src="
                (play?.creator?.backgroundUrl || play?.creator?.coverImgUrl) +
                '?param=144y90'
              "
              :alt="play.alg_sq_featured"
              class="object-cover block w-full h-full cneter"
            />
          </div>
          <router-link
            :to="{ path: '/playlist', query: { id: play.id } }"
            class="absolute top-0 bottom-0 left-0 right-0 z-50"
            target="_blank"
          ></router-link>
          <DiscoverPlayCount
            :play-count="play.playCount"
            :count-ref="countRef"
            :cur-index="curIndex"
            :index="index"
          />
          <p class="whitespace-pre-wrap text-left fotn_title">
            <a href="javscript:;;">
              {{ play.name }}
            </a>
          </p>
        </section>
      </li>
    </div>
  </ul>
</template>
<script setup lang="ts">
import { defineProps, nextTick, onMounted, ref, watch } from "vue";

import { useRefNegate } from "../../../../utils/useRefNegate";
import { createLoading } from "../../../../components/loading/app";

import DiscoverPlayCount from "./DiscoverPlayCount.vue";

import type { PropType } from "vue";
import type { PlayListOptions } from "../type";

const props = defineProps({
  playlist: {
    type: Array as PropType<Array<PlayListOptions>>,
    default: () => [],
  },
});

const listsong = ref<HTMLElement | null>(null);

const loadingMountAttribute = new createLoading();

const curIndex = ref(0);
const { countRef, negate } = useRefNegate(false);

function mouseenter(index: number) {
  curIndex.value = index;
  negate();
}

onMounted(() => {
  if (!loadingMountAttribute.isMountApp() && listsong.value) {
    loadingMountAttribute.mountApp(listsong.value);

    const step = watch(
      () => props.playlist,
      () =>
        nextTick().then(() => {
          loadingMountAttribute.unmountApp(loadingMountAttribute.negate);
          step();
        })
    );
  }
});
</script>
<style scoped lang="scss">
.root_image_item {
  width: 144px;
  height: 144px;
}

.cneter {
  margin: 0 auto;

  & > div {
    width: 144px;
    height: 90px;

    & > div {
      width: 100%;
      height: 90px;
    }
  }
}

.playlist {
  width: 140px;
  height: 140px;
  color: rgb(80, 79, 79);
}

.bg_gray {
  background: rgba(0, 0, 0, 0.405);
}

.font_title {
  font-size: 140px;
}
</style>
