<template>
  <el-container class="h-full">
    <el-header class="flex items-center solide_border">
      <el-avatar :size="32" :src="viewMsg[0].avatarUrl"></el-avatar>
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
          />
        </el-main>
        <el-footer
          :height="`${size}px`"
          class="flex items-cneter solide_border_top"
        >
          <MessageFoolterWriteBox v-model:vlaue="modelValue" />
        </el-footer>
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
  watch,
} from "vue";

import { debounce } from "../../../utils/debounce";
import { size } from "../hook/data";

import MessageFoolterWriteBox from "./MessageFoolterWriteBox.vue";
import MessageChatBoxItem from "./MessageChatBoxItem.vue";
import {
  ElContainer,
  ElFooter,
  ElHeader,
  ElMain,
  ElAvatar,
} from "element-plus";

import type { PropType } from "vue";

const ctxEmit = defineEmit(["emitRequest"]);

const modelValue = ref("ddddd");

watch(modelValue, (value) => {
  console.log(value);
});

const props = defineProps({
  viewMsg: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const mesMain = ref<any | null>(null);

const mesList = computed<any>(() =>
  props.viewMsg[1]
    .map((v, i) => ({
      keyindex: i,
      ...v,
    }))
    .reverse()
);

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

function setMainScrollTop() {
  if (mesMain.value) {
    const el = mesMain.value.$el;

    const scrollHeight = el.scrollHeight;

    if (scrollHeight) {
      el.scrollTop = scrollHeight;
    }
  }
}

watch(
  () => props.viewMsg,
  () => setMainScrollTop()
);

onMounted(() => {
  nextTick().then(() => setMainScrollTop());
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
