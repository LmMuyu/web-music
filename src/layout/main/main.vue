<template>
  <div class="flex h-full overflow-y-hidden">
    <div v-if="isTagShow" class="float-left w-1/6 h-full right_border">
      <div class="h-full" :style="{ minHeight: minheight + 'px' }">
        <index-aside-tags />
      </div>
    </div>
    <div
      class="overflow-hidden h-full relative"
      :class="[isTagShow ? 'w-5/6' : 'w-full']"
      :style="{ minWidth: minwidth + 'px' }"
    >
      <MainContainer></MainContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";

import { useMinWh } from "./hooks/useMinWH";
import { useWatchHost } from "../../utils/useWatchHost";

import MainContainer from "../../components/maincontent/MainContainer.vue";
import IndexAsideTags from "./component/MainAsideTags.vue";
import { throttle } from "../../utils/throttle";

const isTagShow = useWatchHost();
const windowResize = ref(true);

provide("windowResize", windowResize);

const { minwidth, minheight } = useMinWh();

const minWidth = 1024;

function addEventResize() {
  const _resize = throttle(resize, 50, {
    initThrollte: true,
  });

  function resize() {
    const dcw = document.documentElement.clientWidth;

    if (dcw <= minWidth) {
      windowResize.value = false;
    } else if (!windowResize.value) {
      windowResize.value = true;
    }
  }

  _resize();

  window.addEventListener("resize", _resize, false);
}

onMounted(addEventResize);
</script>

<style scoped lang="scss">
.right_border {
  border-right: 1px solid #f5f6fa;
}

.min-h-w {
  min-height: 620px;
}

.golbalmark {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}
</style>
