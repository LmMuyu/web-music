<template>
  <ul ref="listsong">
    <div class="flex flex-wrap" v-if="loadingMountAttribute.countRef">
      <li
        v-for="(play, index) in playlist"
        :key="play.id"
        style="width: 25%"
        class="root_image_item flex justify-center overflow-hidden my-4"
        :class="{ 'px-4': paddingList.includes(index + 1) }"
      >
        <DiscoverCard
          :countRef="countRef"
          :curIndex="curIndex"
          :index="index"
          :play="play"
          :negate="negate"
          :onMouseenter="onMouseenter"
        />
      </li>
    </div>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps, nextTick, onMounted, ref, watch } from "vue";

import { useRefNegate } from "../../../../utils/useRefNegate";
import { createLoading } from "../../../../components/loading/app";

import DiscoverCard from "./DiscoverCard.vue";

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

const onMouseenter = (index: number) => {
  curIndex.value = index;
  negate();
}

const paddingList = computed(() => {
  const posList = []
  const len = props.playlist.length / 4

  for (let i = 0; i < len; i++) {
    posList.push([2 + (4 * i), 3 + (4 * i)])
  }


  return posList.flat(Infinity)
})

console.log(paddingList.value);

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
