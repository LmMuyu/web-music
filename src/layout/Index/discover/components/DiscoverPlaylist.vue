<template>
  <article class="mt-8">
    <ElRow tag="ul" class="flex justify-between">
      <ElCol
        tag="li"
        :span="6"
        v-for="play in playlist"
        :key="play.id"
        class="flex"
      >
        <section class="text-center px-4 pb-6">
          <div class="relative w-auto h-auto">
            <img
              :src="play?.creator?.backgroundUrl || play?.creator?.coverImgUrl"
              :alt="play.alg_sq_featured"
              class="object-contain block w-auto h-auto cneter"
            />
            <router-link
              :to="{ path: '/playlist', query: { id: play.id } }"
              class="absolute top-0 bottom-0 left-0 right-0 z-50"
            ></router-link>
            <div
              class="
                text-left
                icon
                bg_gray
                w-full
                absolute
                left-0
                bottom-0
                p-1
                flex
                items-center
              "
            >
              <i class="iconfont iconicon_headset"></i>
              <p style="color: #ecf0f1" class="transform translate-x-1">
                {{ playCount(play?.playCount) }}
              </p>
            </div>
          </div>
          <p class="whitespace-pre-wrap text-left" style="width: 140px">
            <a href="javscript:;;">
              {{ play.name }}
            </a>
          </p>
        </section>
      </ElCol>
    </ElRow>
  </article>
</template>
<script setup lang="ts">
import { defineProps, computed } from "vue";

import { ElRow, ElCol } from "element-plus";

import type { PropType } from "vue";

const props = defineProps({
  playlist: {
    type: Array as PropType<Array<Object>>,
    default: () => [],
  },
});

const playSrc = computed(() => {
  return function (src: string) {
    return src;
  };
});

const playCount = computed(() => {
  return function (count: number) {
    const playstr = String(count);
    const playlen = playstr.length;

    if (playlen >= 4) return count;
    const switchNum = playlen > 4 ? 0 : playlen > 8 ? 1 : 2;

    switch (switchNum) {
      case 0:
        const sliceSite = playlen - 4;
        return playstr.slice(0, sliceSite) + "万";
      case 1:
        const slicenum = playlen - 8;
        return playstr.slice(0, slicenum) + "万";
      default:
        return;
    }
  };
});
</script>
<style scoped lang="scss">
.icon {
  @include Iconfont(#ecf0f1);
}

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
