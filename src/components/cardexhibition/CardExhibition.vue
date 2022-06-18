<template>
  <div
    :class="[margin_right(Number(keyindex) + 1), activeIndex === keyindex && 'bg-white', rootclass]"
    class="relative cursor-pointer"
    @mouseenter.stop="() => active(Number(keyindex))"
    @mouseleave.stop="() => leave()"
  >
    <div class="w-full h-44 bg-white">
      <img
        :src="(data.picUrl ?? data.cover) + '?param=224y176'"
        :alt="data.commentThreadId"
        class="object-cover w-full h-full"
      />
    </div>
    <div class="flex flex-col p-8">
      <span class="text-lg" style="color: #545499" v-if="data.artistName">
        {{ data.artistName }}
      </span>
      <span class="text-lg clapm" style="color: #545499">{{ data.name }}</span>
      <span class="text-sm" style="color: #19191b"> {{ data.size }}张专辑 </span>
    </div>
    <Transition name="fide">
      <div class="absolute" style="top: 16vh; right: 2vw" v-show="activeIndex === keyindex">
        <PlayerIcon />
      </div>
    </Transition>
    <router-link
      :to="{ path, query: { id: data.id ?? data.artistId } }"
      class="absolute top-0 left-0 w-full h-full"
      :target="target"
    ></router-link>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { margin_right } from "../../layout/index/hook";

import PlayerIcon from "../playericon/PlayerIcon.vue";

const props = defineProps({
  keyindex: {
    type: Number,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  path: {
    type: String,
    default: "/songdetail",
  },
  target: {
    type: String,
    default: "_self",
  },

  class: String,
});

const activeIndex = ref(null);

function active(index: number) {
  activeIndex.value = index;
}
function leave() {
  activeIndex.value = null;
}

const rootclass = computed(() => props.class);
</script>
<style scoped lang="scss"></style>
