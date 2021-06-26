<template>
  <ElRow tag="ul" class="flex flex-wrap">
    <ElCol
      tag="li"
      :span="6"
      v-for="(play, index) in playlist"
      :key="play.id"
      class="flex overflow-hidden my-4"
    >
      <section class="text-center cneter">
        <div
          class="relative"
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
              class="object-cover block cneter"
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
        </div>
        <p class="whitespace-pre-wrap text-left" style="width: 140px">
          <a href="javscript:;;">
            {{ play.name }}
          </a>
        </p>
      </section>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { defineProps, ref } from "vue";

import { useRrfNegate } from "../../../../utils/useRefNegate";

import { ElRow, ElCol } from "element-plus";
import DiscoverPlayCount from "./DiscoverPlayCount.vue";

import type { PropType } from "vue";
import type { PlayListOptions } from "../type";

const props = defineProps({
  playlist: {
    type: Array as PropType<Array<PlayListOptions>>,
    default: () => [],
  },
});

const curIndex = ref(0);
const { countRef, negate } = useRrfNegate(false);

function mouseenter(index: number) {
  curIndex.value = index;
  negate();
}
</script>
<style scoped lang="scss">
.cneter {
  margin: 0 auto;
}

.playlist {
  width: 140px;
  height: 140px;
  color: rgb(80, 79, 79);
}

.bg_gray {
  background: rgba(0, 0, 0, 0.405);
}
</style>
