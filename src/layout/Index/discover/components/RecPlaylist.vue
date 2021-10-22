<template>
  <div class="w-full relative" :class="markRef ? 'Hmark' : 'h-full'">
    <CardRow :playlist="cardlist" v-if="!markRef" />
  </div>
</template>
<script setup lang="ts">
import { inject, watch, } from "vue";

import { useRefNegate } from "../../../../utils/useRefNegate";

import CardRow from "../../../../components/card/CardRow.vue";

import type { PlayListOptions } from "../type";

const { countRef: markRef, negate: markNegate } = useRefNegate(true);

const cardlist: Array<PlayListOptions> = inject("cardlist");


const cardliststop = watch(cardlist, (value) => {
  markNegate()
  Promise.resolve().then(() => cardliststop())
})

</script>
<style scoped lang="scss">
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

.Hmark {
  height: #{145.42 * 2}px;
}
</style>
