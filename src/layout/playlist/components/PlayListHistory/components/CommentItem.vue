<template>
  <ElRow class="py-2">
    <ElCol v-if="!isBeRepliedComp" :span="2" class="flex">
      <router-link :to="toHomePageOption()">
        <ElAvatar :src="scopedData.user && scopedData.user.avatarUrl" size="default"></ElAvatar>
      </router-link>
    </ElCol>
    <ElCol class="text-sm w-full" :span="isBeRepliedComp ? 24 : 18">
      <div
        :style="{ backgroundColor: isBeRepliedComp ? '#F5F7FA' : '' }"
        :class="isBeRepliedComp ? 'p-2 rounded-md' : 'p-0'"
      >
        <router-link
          class="bottom_line float-left"
          :to="toHomePageOption()"
          :style="{ color: isBeRepliedComp && '#409EFF' }"
          style="color: #409eff"
        >
          {{ (isBeRepliedComp ? "@" : "") + scopedData.user && scopedData.user.nickname }}：
        </router-link>
        <span style="color: #4f4f4f" class="text-xs">
          {{ scopedData.content && scopedData.content }}
        </span>
      </div>

      <div v-if="scopedData.beReplied && scopedData.beReplied.length > 0">
        <CommentItem
          :isBeRepliedComp="true"
          v-for="(beReplied, repindex) in scopedData.beReplied && scopedData.beReplied"
          :key="repindex"
          :scopedData="beReplied"
        />
      </div>

      <div v-if="!isBeRepliedComp" class="py-2 flex justify-between">
        <span class="text-xs flex-1">{{
          yearMonthDay(formatTime(scopedData.time && scopedData.time, "ymd_hms"))
        }}</span>
        <MainContentFooter style="flex:2"  :size="14" :info="unref(comment_footerInfo)(props)" />
      </div>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { PropType, unref } from "vue";

import { formatTime } from "../../../../../utils/filterDate";
import { comment_footerInfo } from "../../../../subscription/methods";

import CommentItem from "./CommentItem.vue";
import { ElAvatar, ElCol, ElRow } from "element-plus";
import MainContentFooter from "../../../../subscription/components/MainContentFooter.vue";

const props = defineProps({
  scopedData: {
    type: Object as PropType<any>,
    required: true,
  },
  isBeRepliedComp: {
    type: Boolean,
    default: false,
  },
});

function yearMonthDay(time: string) {
  let gangnum = 3;

  const timearr = time.split("");
  const strarr = ["年", "月", "日 "];

  const newtimearr = timearr.map((t) => {
    if (t === "-" || t === " ") {
      const nt = strarr[Math.abs(gangnum - 3)];
      gangnum -= 1;
      return nt;
    }

    return t;
  });

  return newtimearr.join("");
}

function toHomePageOption() {
  return {
    path: "/user/home",
    query: {
      uid: props.scopedData && props.scopedData.user && props.scopedData.user.userId,
      isself: true,
    },
  };
}
</script>
<style scoped lang="scss"></style>
