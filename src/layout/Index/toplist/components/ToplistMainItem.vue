<template>
  <div
    class="flex items-center p-2 w-full cursor-pointer borderslode"
    ref="features"
    @mouseenter="onMouseEnter(index)"
    @mouseleave="negate"
    :style="style"
  >
    <div class="flex items-center w-full">
      <el-checkbox v-if="isCheckbox" v-model="select"></el-checkbox>
      <router-link
        :to="{ path: '/playlist', query: { id: renderItem.id } }"
        tag="a"
        target="_blank"
      >
        <div class="w-full flex py-4 items-center">
          <span class="music_name ml-3 flex">
            <p class="text_color text-sm">
              {{ renderItem?.ar[0]?.name }} - {{ renderItem?.al?.name }}
            </p>
            <p v-html="aliasName(renderItem?.alia || [])"></p>
          </span>
        </div>
      </router-link>
    </div>
    <div>
      <ToplistMainFeaturesModule v-if="curIndex === index && featuresModule" />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  defineProps,
  ref,
  computed,
  watch,
  defineEmits,
} from "@vue/runtime-core";

import { useRefNegate } from "../../../../utils/useRefNegate";

import ToplistMainFeaturesModule from "./ToplistMainFeaturesModule.vue";
import { ElCheckbox } from "element-plus";

import type { PropType, Ref } from "vue";

const ctxEmit = defineEmits(["change"]);

const props = defineProps({
  renderItem: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
  keyindex: {
    type: String,
    default: "",
  },
  isCheckbox: {
    type: Boolean,
    default: true,
  },
  isRank: {
    type: Boolean,
    default: true,
  },
  style: {
    type: Object as PropType<{
      [k: string]: string;
    }>,
  },
});

const select: Ref<boolean> = props.renderItem.select;
const curIndex = ref(0);

const { negate, countRef: featuresModule } = useRefNegate(false);

function currentIndex(index: number) {
  curIndex.value = index;
}

function onMouseEnter(index: number) {
  currentIndex(index);
  negate();
}

watch(select, (value) => ctxEmit("change", value));

const aliasName = computed(() => {
  return function (item: []) {
    return item.reduce(
      (pre, cur) =>
        (pre += `<h4 class="text-sm text-gray-300">&nbsp -(${cur})</h4>`),
      ""
    );
  };
});
</script>
<style scoped lang="scss">
$textcolor: #74b9ff;

.text_color {
  color: $textcolor;
}

.music_name {
  &:deep(.text_color) {
    color: #2d3436;
  }
}
</style>
