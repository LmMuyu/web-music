<template>
  <section class="w-full my-6 flex items-center px-2" style="background-color: #f5f5f5">
    <div class="h-full relative">
      <el-image
        :src="songData.picUrl"
        class="object-cover"
        fit="cover"
        style="width: 42px; height: 42px"
        :alt="songData.name"
      />
    </div>
    <div class="flex flex-col justify-around ml-4 decor">
      <div ref="musicname"></div>
      <div ref="musicnickname" class="flex items-center decor"></div>
    </div>
  </section>
</template>
<script setup lang="tsx">
import { computed, defineProps, onMounted, ref, nextTick } from "vue";

import { ElImage } from "element-plus";

import { routerLinkRender } from "../renderNode";

const props = defineProps({
  songData: {
    type: Object,
    default: () => ({}),
  },
});

const musicname = ref(null);
const musicnickname = ref(null);

const addIdentifier = computed(() => {
  return function (index: any) {
    return index < props.songData.singerInfo.length - 1 && "/";
  };
});

onMounted(async () => {
  await nextTick();
  if (musicname.value) {
    routerLinkRender(
      musicname,
      { id: props.songData.id, style: { color: "#74b9ff" }, class: "bottom_line" },
      <p class="decor">{props.songData.name}</p>,
      {
        target: "_blank",
      }
    );
  }

  if (musicnickname.value) {
    routerLinkRender(
      musicnickname,
      (props.songData.singerInfo as any[]).map((singer, index) => ({
        uid: singer.id,
        style: { color: "#74b9ff" },
        slot: <p>{singer.name + " " + addIdentifier.value(index)}</p>,
        class: "text-sm bottom_line",
      }))
    );
  }
});
</script>
<style scoped lang="scss"></style>
