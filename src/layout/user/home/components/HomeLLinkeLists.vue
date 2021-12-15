<template>
  <section class="grid w-full px-6">
    <div v-for="(linke, index) in linkeLists" :key="index" class="flex items-center">
      <div>
        <ElImage
          :src="linke.songs[0].al.picUrl + '?param=512y512'"
          fit="cover"
          @load="imgload"
          style="width: 36px; height: 36px; border-radius: 4px; visibility: hidden"
        />
      </div>
      <div class="flex flex-col px-4">
        <span class="font-bold truncate">{{ linke.songs[0].name }} </span>
        <span v-html="nicknames(linke.songs[0].ar)" style="color: #606266" class="text-xs"> </span>
      </div>
    </div>
  </section>
</template>
<script setup lang="tsx">
import { computed } from "vue";
import { useStore } from "vuex";

import { ElImage } from "element-plus";

const store = useStore();

const nicknames = (ar: Record<string, any>[]) => ar.map((userinfo) => userinfo.name).join("，");

const linkeLists = computed(() => {
  return store.getters["login/getLLinkes"]().map((linke) => linke.data);
});

function imgload(ev: Event) {
  (ev.target as HTMLElement).style.visibility = "visible";
}
</script>
<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
</style>
