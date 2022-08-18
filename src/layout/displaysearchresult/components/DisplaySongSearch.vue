<template>
  <BetterScroll :isminusviewposth="true" :open-h-render="false">
    <detail-song
      v-for="(item, index) in data"
      class="py-2"
      :index="index"
      :track="item"
      :key="index"
    />
    <slot></slot>
  </BetterScroll>
</template>
<script setup lang="ts">
import { PropType } from "vue";

import { musicDetail } from "../../../utils/musicDetail";

import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import DetailSong from "../../../components/detailsongs/DetailSong.vue";

const props = defineProps({
  data: {
    type: Array as PropType<musicDetail[]>,
  },
});
</script>
<style scoped lang="scss"></style>
