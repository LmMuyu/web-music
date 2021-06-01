<template>
  <ElRow :style="styleRow" :class="classRow">
    <ElCol
      v-for="mapping in renderData"
      :key="mapping?._id"
      :span="mapping?.sizeSpan"
      :class="className"
      :tag="colTag"
      :style="styleCol"
    >
      <slot :name="mapping.slot" :item="mapping"></slot>
    </ElCol>
  </ElRow>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import type { PropType } from "vue";
import { ElRow, ElCol } from "element-plus";

const props = defineProps({
  sizeSpan: {
    type: Array as PropType<number[]>,
    default: () => [8, 8, 8],
    validator(value: number[]) {
      return value.reduce((pre, next) => (pre += next), 0) === 24;
    },
  },
  listData: {
    type: Array,
    default: () => [],
  },
  turnonSlot: {
    type: Boolean,
    default: () => false,
  },
  colTag: {
    type: String,
    default: () => "div",
  },
  className: Array | String,
  styleRow: Array | Object,
  classRow: Array | String,
  styleCol: Array | Object,
});

const createRende = (index: number, sizeSpan: number, data = {}) => ({
  ...data,
  sizeSpan,
  _id: "_" + index,
  slot: "slot_" + (data.position ? data.position : index),
});

const mapListData = props.listData
  .slice(0, props.sizeSpan.length)
  .reduce(
    (pre, cur, index) =>
      pre.concat(createRende(index, props.sizeSpan[index], cur)),
    []
  );

const slotName = () => {
  return props.sizeSpan.map((num, index) => createRende(index, num));
};

const renderData = computed(() => {
  return !!props.listData.length ? mapListData : slotName();
});
</script>

<style></style>
