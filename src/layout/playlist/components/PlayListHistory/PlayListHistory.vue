<template>
  <ElDrawer
    @closed="onClosed"
    :showClose="false"
    :withHeader="false"
    :modelValue="isopen"
    size="25%"
  >
    <div class="relative">
      <header>
        <p class="text-base">历史记录</p>
      </header>
      <main class="mb-4">
        <ChildrenItem v-for="(item, index) in data" :key="index" :scopedData="item" />
      </main>
    </div>
  </ElDrawer>
</template>
<script setup lang="ts">
import { defineProps } from "@vue/runtime-core";
import { computed, onMounted, PropType } from "vue";

import { ElDrawer } from "element-plus";
import ChildrenItem from "./components/ChildrenItem.vue";

const props = defineProps({
  record: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({
      allData: [],
      isopen: false,
    }),
  },
  unmountApp: Function,
});

//@ts-ignore
const data = computed(() => props.record.allData.value);

const isopen = computed(() => props.record.isopen);
const onClosed = () => props.unmountApp();

onMounted(() => {
  const section = document.querySelector("section");
  section.style.cssText = `
    
  `;
});
</script>

<style scoped lang="scss"></style>
