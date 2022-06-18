<template>
  <div class="betterscoll">
    <BetterScroll :item-len="Infinity" :open-h-render="false">
      <div class="grid grid-cols-4  pt-4 px-6 h-full">
        <CardExhibition
          v-for="(mv, index) in mvdata"
          :key="index"
          :data="mv"
          :keyindex="index"
          path="/video"
        >
        </CardExhibition>
      </div>
    </BetterScroll>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import CardExhibition from "../../../components/cardexhibition/CardExhibition.vue";
import { musicDetail } from "../../../utils/musicDetail";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const mvdata = ref([]);

watchEffect(() => {
  if (!(props.data[0] instanceof musicDetail)) {
    mvdata.value = props.data;
  }
});
</script>
<style scoped lang="scss"></style>
