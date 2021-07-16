<template>
  <el-container class="h-full">
    <el-header class="flex items-center solide_border">
      <el-avatar size="medium" :src="viewMsg[0].avatarUrl"></el-avatar>
      <span class="ml-4">{{ viewMsg[0].nickname }}</span>
    </el-header>
    <el-container class="relative">
      <el-container class="absolute top-0 bottom-0 w-full h-full">
        <el-main class="overflow-x-hidden" ref="mesMain" @scroll="onScroll">
          <MessageChatBoxItem
            v-for="mes in mesList"
            :key="mes.id"
            :message-info="mes"
            :isfromuser="viewMsg[0].id !== mes.fromUser.userId"
        /></el-main>
        <el-footer class="solide_border_top">Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  ref,
  nextTick,
  defineEmit,
} from "vue";

import { debounce } from "../../../utils/debounce";

import {
  ElContainer,
  ElFooter,
  ElAside,
  ElHeader,
  ElMain,
  ElAvatar,
} from "element-plus";
import MessageChatBoxItem from "./MessageChatBoxItem.vue";

import type { PropType } from "vue";

const ctxEmit = defineEmit(["emitRequest"]);

const props = defineProps({
  viewMsg: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const mesMain = ref<any | null>(null);

const mesList = computed<any>(() => props.viewMsg[1].reverse());

const ebounceFn = debounce(
  () => ctxEmit("emitRequest", props.viewMsg[0].id),
  100
);

const onScroll = (e: Event) => {
  const el = e.target as HTMLElement;
  const scrollTop = el.scrollTop;
  if (scrollTop <= 0) {
    ebounceFn();
  }
};

onMounted(() => {
  nextTick().then(() => {
    if (mesMain.value) {
      const el = mesMain.value.$el;

      const scrollHeight = el.scrollHeight;

      if (scrollHeight) {
        el.scrollTop = scrollHeight;
      }
    }
  });
});
</script>
<style scoped lang="scss">
.solide_border {
  border-bottom: 1px solid #f5f6fa;
}

.solide_border_left {
  border-left: 1px solid #f5f6fa;
}

.solide_border_top {
  border-top: 1px solid #f5f6fa;
}
</style>
