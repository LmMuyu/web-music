<template>
  <div :style="gridStyle()">
    <div v-for="(playitem, index) in playlist" :key="index">
      <PlayColItem :playitem="playitem" />
    </div>
  </div>
</template>
<script setup lang="ts">
import PlayColItem from "./CardColItem.vue";

const props = defineProps({
  playlist: {
    type: Array,
    required: true,
  },
  colItem: {
    type: Number,
    default: 5,
  },
  gap: {
    type: Array,
    default: () => [20, 10],
  },
});

function gridStyle() {
  return {
    width: "100%",
    display: "grid",
    gridTemplateColumns: `repeat(${props.colItem},1fr)`,
    gridGap: props.gap.map((gap) => gap + "" + "px").join(" "),
  };
}
</script>
<style scoped lang="scss">
</style>
