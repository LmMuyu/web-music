<template>
  <el-container class="h-full">
    <el-header class="flex solide_border">
      <div><el-avatar :size="42" :src="letterUser.avatar"></el-avatar></div>
      <span class="ml-4">{{ letterUser.nickname }}</span>
    </el-header>
    <el-main ref="mesMain">
      <better-scroll>
        <message-chat-box-item
          v-for="msg in letterLists"
          :key="msg.fromId"
          :message-info="msg"
          :from-user="letterUser"
          :isfromuser="letterUser.uid !== msg.fromId"
        />
      </better-scroll>
    </el-main>
    <el-footer :height="`${size}px`" class="flex items-cneter solide_border_top">
      <TextEditor />
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import TextEditor from "vue3-text-editor";

import { size } from "../hook/data";

import MessageChatBoxItem from "./MessageChatBoxItem.vue";
import { ElContainer, ElFooter, ElHeader, ElMain, ElAvatar } from "element-plus";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";

import "vue3-text-editor/css/index.css";

import type { PropType } from "vue";
import type followLetterInfo from "../hook/followLetterInfo";
import type { SendLetterInfoEmit } from "../type";

const props = defineProps({
  letterLists: {
    type: Array as PropType<followLetterInfo[]>,
    required: true,
  },
  letterUser: {
    type: Object as PropType<SendLetterInfoEmit>,
    required: true,
  },
});

const modelValue = ref("ddddd");

watch(modelValue, (value) => {
  console.log(value);
});

const mesMain = ref<any | null>(null);
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
