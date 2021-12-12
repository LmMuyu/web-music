<template>
  <section class="grid w-full px-6">
    <div v-for="(linke, index) in linkeLists" :key="index" class="flex items-center">
      <div>
        <ElAvatar fit="cover" size="medium" shape="square" :src="linke.songs[0].al.picUrl" />
      </div>
      <div class="flex flex-col px-4">
        <span class="font-bold truncate">{{ linke.songs[0].name }} </span>
        <span v-html="nicknames(linke.songs[0].ar)" style="color: #606266" class="text-xs"> </span>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

import { ElAvatar } from "element-plus";

const store = useStore();

const nicknames = (ar: Record<string, any>[]) => ar.map((userinfo) => userinfo.name).join("，");

const linkeLists = computed(() => {
  return store.getters["login/getLLinkes"]().map((linke) => linke.data);
});
</script>
<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
</style>
