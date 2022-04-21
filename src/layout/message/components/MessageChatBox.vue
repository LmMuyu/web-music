<template>
  <el-container class="h-full">
    <el-header class="flex solide_border">
      <div>
        <el-avatar :size="42" :src="privateLetter.propleInfo.avatarUrl"></el-avatar>
      </div>
      <span class="ml-4">
        <p>{{ privateLetter.propleInfo.nickname }}</p>
      </span>
    </el-header>
    <el-main class="overflow-x-hidden" ref="mesMain" @scroll="onScroll">
      <div v-if="privateLetter.totals.length > 0">
        <MessageChatBoxItem
          v-for="mes in letterList"
          :key="mes.id"
          :message-info="mes"
          :isfromuser="privateLetter.propleInfo.uid !== mes.fromUser.userId"
        />
      </div>
    </el-main>
    <el-footer :height="`${size}px`" class="flex items-cneter solide_border_top">
      <TextEditor />
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { computed, defineProps, onMounted, ref, nextTick, defineEmits, watch } from "vue";

import { debounce } from "../../../utils/debounce";
import { size } from "../hook/data";

import MessageChatBoxItem from "./MessageChatBoxItem.vue";
import { ElContainer, ElFooter, ElHeader, ElMain, ElAvatar } from "element-plus";
import TextEditor from "vue3-text-editor";

import "vue3-text-editor/css/index.css";

import type { PropType } from "vue";
import type { PRIVATEPROPLEL_AND_ETTER } from "../type";

const ctxEmit = defineEmits(["emitRequest"]);

const modelValue = ref("ddddd");

watch(modelValue, (value) => {
  console.log(value);
});

const props = defineProps({
  privateLetter: {
    type: Object as PropType<PRIVATEPROPLEL_AND_ETTER>,
    required: true,
  },
});

const mesMain = ref<any | null>(null);

const letterList = computed<any>(() =>
  props.privateLetter.totals
    .map((v, i) => ({
      keyindex: i,
      ...v,
    }))
    .reverse()
);

const ebounceFn = debounce(() => ctxEmit("emitRequest", props.privateLetter.propleInfo.uid), 100);

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
  () => props.privateLetter,
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
