<template>
  <HeadTitle title="热门歌单" />
  <div class="flex justify-between">
    <router-link
      style="width: 134px"
      class="block h-36 relative cursor-pointer"
      v-for="(item, index) in playList"
      :key="index"
      :to="{
        path: '/songdetail',
        query: { id: item.id },
      }"
      :class="margin_right(index + 1, 6)"
      @mouseenter.stop="onMouseenter(index)"
      @mouseleave.stop="onMouseleave"
    >
      <div :style="setLinearGradient(index + 1)" class="absolute top-0 left-0 w-full h-full"></div>
      <div>
        <img
          :style="{ backgroundImage: `url(${item.coverImgUrl + '?param=134y144'})` }"
          :src="item.coverImgUrl + '?param=134y144'"
          :alt="item.description"
        />
      </div>
      <transition name="fade">
        <div
          v-show="showPlayIcon === index"
          class="flex justify-center items-center absolute top-0 left-0 w-full h-full"
        >
          <PlayIcon />
        </div>
      </transition>
    </router-link>
  </div>
</template>
<script setup lang="ts">
import { PropType, ref } from "vue";
import { margin_right } from "../hook";
import HeadTitle from "./IndexModuleHeadTitle.vue";
import PlayIcon from "./IndexPlayIcon.vue";

const props = defineProps({
  playList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const showPlayIcon = ref(null);

function onMouseenter(index: number) {
  showPlayIcon.value = index;
}

function onMouseleave() {
  showPlayIcon.value = null;
}

const linearGradient: Record<
  number,
  {
    pos: string;
    colors: string[];
  }
> = {
  1: {
    pos: "to bottom",
    colors: ["#4FACFE", "#00F2FE"],
  },
  2: {
    pos: "-30deg",
    colors: ["#F794A4", "#FDD6BD"],
  },
  3: {
    pos: "-45deg",
    colors: ["#5271C4 0%", "#B19FFF 50%", "#ECA1FE 100%"],
  },
  4: {
    pos: "to top",
    colors: ["#A18CD1", "#FBC2EB"],
  },
  5: {
    pos: "to right",
    colors: ["#FF758C", "#FF7EB3"],
  },

  6: {
    pos: "30deg",
    colors: ["#FF5858", "#F09819"],
  },
};

function setLinearGradient(pos: number) {
  const posinfo = linearGradient[pos];
  if (posinfo) {
    return {
      backgroundImage: `linear-gradient(${posinfo.pos}, ${posinfo.colors.join(",")})`,
      opacity: 0.77,
    };
  }
}
</script>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
