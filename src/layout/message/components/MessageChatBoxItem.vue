<template>
  <div class="flex justify-start py-2" :class="!isfromuser && 'flex-row-reverse'">
    <div>
      <el-avatar :size="32" :src="fromUser.avatar"></el-avatar>
    </div>
    <div class="px-2 flex flex-col w-3/4" :class="!isfromuser && 'items-end'">
      <pre class="text-xs py-2">{{ formatTime(messageInfo.time, "ymd_hms") }}</pre>
      <p
        style="word-wrap: break-word"
        class="text-sm text-left p-3 rounded-md"
        :style="{ backgroundColor: isfromuser ? '#dcf3fe' : '#F2F6FA' }"
      >
        {{ messageInfo.letterMes.msg }}
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, defineProps, PropType } from "vue";

import { ElAvatar } from "element-plus";

import type { SendLetterInfoEmit } from "../type";

import followLetterInfo from "../hook/followLetterInfo";
import { formatTime } from "../../../utils/filterDate";

const props = defineProps({
  messageInfo: {
    type: Object as PropType<followLetterInfo>,
    required: true,
  },
  isfromuser: {
    type: Boolean,
    required: true,
  },
  fromUser: {
    type: Object as PropType<SendLetterInfoEmit>,
    required: true,
  },
});

console.log(props.messageInfo);

const putmsg = computed(() => {
  return function (str: string) {
    return JSON.parse(str)["msg"];
  };
});
</script>
<style scoped lang="scss"></style>
