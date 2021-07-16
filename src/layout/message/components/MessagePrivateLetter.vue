<template>
  <ul class="overflow-auto absolute left-0 top-0 w-full h-full track">
    <li
      class="flex w-full py-3 px-6 cursor-pointer"
      v-for="mess in privateLetterList"
      :key="mess.fromUser.userId"
      @click="
        onFindID(
          mess.fromUser.userId,
          mess.fromUser.avatarUrl,
          mess.fromUser.nickname
        )
      "
    >
      <div style="width: 20%" class="flex items-center">
        <ElAvatar :src="mess.fromUser.avatarUrl" />
      </div>
      <div style="width: 80%" class="flex flex-col justify-between">
        <div class="w-full flex items-center justify-between">
          <span class="text-sm" style="color: #2f4154">{{
            mess.fromUser.nickname
          }}</span>
          <span class="text-xs whitespace-nowrap">{{
            diffTime(mess.lastMsgTime)
          }}</span>
        </div>
        <div class="w-full flex justify-between">
          <span
            :style="{ color: mess.newMsgCount > 0 ? '#556574' : '#a6aeb6' }"
            style="width: 90%"
            class="text-xs truncate"
            >{{ lastMsg(mess.lastMsg) }}</span
          >
          <div style="width: 10%">
            <span
              v-if="mess.newMsgCount > 0"
              class="
                flex
                justify-center
                items-center
                text-sm
                float-right
                bg_color
              "
              >{{ mess.newMsgCount }}</span
            >
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import { computed, defineProps, defineEmit } from "vue";
import dayjs from "dayjs";

import { ElAvatar } from "element-plus";

import type { PropType } from "vue";
import type { dayAttribute } from "../../../type";

const ctxEmit = defineEmit(["viewmsg"]);

const props = defineProps({
  privateLetterList: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
});

const onFindID = (id: number, avatarUrl: string, nickname: string) =>
  ctxEmit("viewmsg", { id, avatarUrl, nickname });

const returnDateList = (dateAttribute: dayAttribute) => [
  dateAttribute.$y,
  dateAttribute.$M + 1,
  dateAttribute.$D,
  dateAttribute.$H,
  dateAttribute.$m,
  dateAttribute.$s,
];

const lastMsg = computed(() => {
  return function (mes: string) {
    const lastMes = JSON.parse(mes);
    return lastMes["msg"];
  };
});

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
<style scoped lang="scss">
.bg_color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: #1f84cf;
  background-color: #e5f3fe;
}

.track::-webkit-scrollbar {
  display: none;
}
</style>
