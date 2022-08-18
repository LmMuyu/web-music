<template>
  <DisplayAlbums :outsidealbums="albums" :donreferto="true">
    <slot></slot>
  </DisplayAlbums>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { musicDetail } from "../../../utils/musicDetail";
import DisplayAlbums from "../../index/components/IndexRecentlyAlbums.vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const albums = ref([]);

watchEffect(() => {
  if (!(props.data instanceof musicDetail)) {
    albums.value = props.data;
  }
});
</script>
<style scoped lang="scss"></style>
