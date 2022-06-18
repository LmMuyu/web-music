<template>
  <section class="betterscroll w-full px-6">
    <div v-for="(linke, index) in linkeLists.slice(0, 12)" :key="index" class="flex items-center">
      <div>
        <ElImage
          :src="linke.picUrl + '?param=512y512'"
          fit="cover"
          @load="imgload"
          style="width: 36px; height: 36px; border-radius: 4px; visibility: hidden"
        />
      </div>
      <div class="flex flex-col px-4">
        <span class="font-bold truncate">{{ linke.name }} </span>
        <span v-html="linke.nickName" style="color: #606266" class="text-xs"> </span>
      </div>
    </div>
  </section>
</template>
<script setup lang="tsx">
import { ElImage } from "element-plus";
import { PropType } from "vue";

const props = defineProps({
  linkeLists: {
    type: Array as PropType<any[]>,
    required: true,
  },
});

function imgload(ev: Event) {
  (ev.target as HTMLElement).style.visibility = "visible";
}
</script>
<style scoped lang="scss">
.betterscroll {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
</style>
