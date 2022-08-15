<template>
  <el-container class="h-full">
    <el-header class="flex items-center solide_border">
      <div><el-avatar :size="42" :src="letterUser.avatar"></el-avatar></div>
      <span class="ml-4">{{ letterUser.nickname }}</span>
    </el-header>
    <el-main ref="mesMain" style="overflow: hidden">
      <better-scroll :isminusviewposth="true" :open-h-render="false" :item-len="letterLists.length">
        <message-chat-box-item
          v-for="msg in letterLists"
          :key="msg.fromId"
          :message-info="msg"
          :from-user="letterUser"
          :isfromuser="letterUser.uid !== msg.fromId"
        />
      </better-scroll>
    </el-main>
    <el-footer height="240" class="flex items-cneter solide_border_top">
      <div class="py-2 w-full">
        <TextEditor
          @upLoadImage="upLoadImage"
          :appendToContainer="false"
          :AiteUserData="[]"
          @editor_content="editorContent"
        />
      </div>
    </el-footer>
  </el-container>
</template>
<script setup lang="ts">
import { defineProps, ref, watch } from "vue";

import { ElContainer, ElFooter, ElHeader, ElMain, ElAvatar } from "element-plus";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import MessageChatBoxItem from "./MessageChatBoxItem.vue";
import { TextEditor } from "vue3-text-editor";

import type followLetterInfo from "../hook/followLetterInfo";
import type { SendLetterInfoEmit } from "../type";
import type { PropType } from "vue";

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
const mesMain = ref<any | null>(null);

function editorContent(content: string) {
  console.log(content);
}

function upLoadImage(files: any) {
  console.log(files);
}

watch(modelValue, (value) => {
  console.log(value);
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
