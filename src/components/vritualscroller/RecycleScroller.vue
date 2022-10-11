<template>
  <RecycleScroller
    :style="{ height: weapperHeight + 'vh' }"
    :key-field="field"
    :items="lists"
    :item-size="itemSize"
    :emitUpdate="true"
    ref="recycle"
  >
    <template v-slot="{ item }">
      <component :item="item.data" :is="comp"></component>
    </template>
    <template #after>
      <SvgLoadingVue v-if="updateLoading"></SvgLoadingVue>
    </template>
  </RecycleScroller>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import { vritualProps } from "./props";

import SvgLoadingVue from "../svgloading/SvgLoading.vue";

const ctxEmit = defineEmits(["update"]);
const props = defineProps(vritualProps);

const recycle = ref(null);
const updateLoading = ref(false);
const totalHeight = computed(() => {
  const { colDimension, twoDimension, itemSize, items } = props;
  let take = items.length;

  if (twoDimension) {
    take = Math.ceil(items.length / colDimension);
  }

  return itemSize * take;
});

function twoDimensionArray() {
  const { field, twoDimension, items, colDimension } = props;

  if (!twoDimension) return items as any[];
  const twoDimensionLists = ref([]);

  let startsl = 0;
  let endsl = Math.min(startsl + colDimension, Infinity);
  let preforcount = 0;
  let preslicei = 0;

  watchEffect(() => {
    // debugger;
    const len = items.length;

    //初始化截取区间
    startsl = preslicei;
    endsl = Math.min(startsl + colDimension, len);

    console.log({ startsl, endsl });

    const forcount = Math.ceil(len / colDimension);

    for (let i = preforcount; i < forcount; i++) {
      const list = items.slice(startsl, endsl);

      twoDimensionLists.value.push({
        [field]: list[0][field],
        data: list,
      });

      startsl = endsl;
      endsl = Math.min(startsl + colDimension, len);
    }

    preforcount = forcount;
    preslicei = endsl;
  });

  return twoDimensionLists;
}

const lists = twoDimensionArray();

function touchGround(totalScrollHeight: number, currScrollHeight: number) {
  const diffH = 10;
  if (currScrollHeight >= totalScrollHeight - diffH) {
    updateLoading.value = true;
    ctxEmit("update", () => {
      updateLoading.value = false;
    });
  }
}

onMounted(async () => {
  const el = recycle.value.$el as HTMLElement;
  const viewPortHeight = el.clientHeight;
  const scrollHeight = totalHeight;

  el.addEventListener("scroll", (ev) => {
    const sel = ev.target as HTMLElement;
    const currSH = sel.scrollTop + viewPortHeight;
    touchGround(scrollHeight.value, currSH);
  });
});
</script>
<style lang="scss" scoped></style>
