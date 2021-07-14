<template>
  <ul class="h-full overflow-y-hidden">
    <li
      class="flex w-full py-2"
      v-for="(mess, index) in privateLetterList"
      :key="mess.fromUser.userId"
    >
      <div style="width: 20%" class="flex items-center">
        <ElAvatar :src="mess.fromUser.avatarUrl" />
      </div>
      <div style="width: 80%" class="flex flex-col items-baseline">
        <div class="w-full flex items-center justify-between">
          <span class="text-sm">{{ mess.fromUser.nickname }}</span>
          <span class="text-xs whitespace-nowrap">{{
            diffTime(mess.lastMsgTime)
          }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm">awdaw</span>
          <span class="text-sm float-right">{{ mess.newMsgCount }}</span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";
import dayjs from "dayjs";

import { ElAvatar } from "element-plus";

import type { PropType } from "vue";

interface dayAttribute {
  $D: number;
  $H: number;
  $L: string;
  $M: number;
  $W: number;
  $d: string;
  $m: number;
  $ms: number;
  $s: number;
  $u: undefined;
  $x: Object;
  $y: number;
}

const props = defineProps({
  privateLetterList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const returnDateList = (dateAttribute: dayAttribute) => [
  dateAttribute.$y,
  dateAttribute.$M + 1,
  dateAttribute.$D,
  dateAttribute.$H,
  dateAttribute.$m,
  dateAttribute.$s,
];

const diffTime = computed(() => {
  return function (time: number) {
    const now_one = dayjs(time) as unknown as dayAttribute;
    const now_two = dayjs() as unknown as dayAttribute;

    const now_one_list = returnDateList(now_one);
    const now_two_list = returnDateList(now_two);

    const list = now_one_list.filter((v) => !now_two_list.includes(v));

    const len = list.length;

    if (len === 1) {
      return list.join("") + "秒前";
    } else if (len === 2) {
      return list[0] + "分前";
    } else if (len === 3) {
      return list[0] + "小时前";
    } else if (len === 4) {
      return list[0] + "天前";
    } else if (len === 5) {
      return `${list[0]}月${list[1]}日`;
    } else {
      return ` ${list[0]}年${list[1]}月${list[2]}日`;
    }
  };
});
</script>
<style scoped lang="scss"></style>
