<template>
  <VirtualList :render-data="songlist" keyindex="id">
    <template v-slot="{ scopeData: { renderItem } }">
      <HomeSongItem :songitem="renderItem" />
    </template>
  </VirtualList>
</template>
<script setup lang="ts">
import VirtualList from "../../../../components/virtuallist/VirtualList.vue";
import HomeSongItem from "./HomeSongItem.vue";

const props = defineProps({
  songlist: {
    type: Array,
    default: () => [],
  },
});
</script>
<style scoped lang="scss"></style>
