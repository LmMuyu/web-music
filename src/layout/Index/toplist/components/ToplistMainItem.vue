<template>
  <div
    class="flex items-center p-3 w-full cursor-pointer borderslode"
    ref="features"
    @mouseenter="[currentIndex(index), negate()]"
    @mouseleave="negate"
  >
    <div class="flex items-center w-full">
      <el-checkbox v-if="isCheckbox" v-model="renderItem.select"></el-checkbox>
      <h4
        v-if="isRank"
        :class="[
          index + 1 <= 3 ? 'text-red-600 text-2xl' : 'text-gray-300 text-xl',
        ]"
        class="text px-2"
      >
        {{ index + 1 }}
      </h4>
      <router-link
        :to="{ path: '/playlist', query: { id: renderItem.id } }"
        tag="a"
        target="_blank"
      >
        <div class="w-full flex py-4 items-center">
          <span class="ml-3 flex">
            {{ renderItem?.ar[0]?.name }} - {{ renderItem?.al?.name }}
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
import { defineProps, ref, computed } from "@vue/runtime-core";

import { useRrfNegate } from "../../../../utils/useRefNegate";

import ToplistMainFeaturesModule from "./ToplistMainFeaturesModule.vue";
import { ElCheckbox } from "element-plus";

const props = defineProps({
  renderItem: {
    type: Object,
    default: () => ({}),
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
});

const curIndex = ref(0);

const { negate, countRef: featuresModule } = useRrfNegate(false);

function currentIndex(index: number) {
  curIndex.value = index;
}

const aliasName = computed(() => {
  return function (item: []) {
    return item.reduce(
      (pre, cur) => (pre += `<h4 class="text-gray-300">&nbsp -(${cur})</h4>`),
      ""
    );
  };
});
</script>
<style scoped lang="scss"></style>
