<template>
  <ElRow class="py-2">
    <ElCol v-if="!isBeRepliedComp" :span="2" class="flex">
      <router-link :to="toHomePageOption()">
        <ElAvatar
          :src="foolterScopedData.user && foolterScopedData.user.avatarUrl"
          size="default"
        ></ElAvatar>
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
          {{
            (isBeRepliedComp ? "@" : "") + foolterScopedData.user &&
            foolterScopedData.user.nickname
          }}：
        </router-link>
        <span style="color: #4f4f4f" class="text-xs">
          {{ foolterScopedData.content && foolterScopedData.content }}
        </span>

        <slot></slot>
      </div>

      <div v-if="foolterScopedData.beReplied && foolterScopedData.beReplied.length > 0">
        <CommentItem
          :isBeRepliedComp="true"
          v-for="(beReplied, repindex) in beRepliedData"
          :key="repindex"
          :scopedData="beReplied"
        >
          <div
            v-if="foolterScopedData.beReplied && foolterScopedData.beReplied.length > 3"
            style="color: #b1b3b8"
            class="text-sm flex items-center pt-2"
          >
            <span>共{{ foolterScopedData.beReplied.length }}条回复，</span>
            <span class="hover cursor-pointer" @click="openReplyAll = true"> 点击查看 </span>
          </div>
        </CommentItem>

        <el-pagination
          v-if="openReplyAll"
          v-model:currentPage="currentPage"
          :page-size="10"
          :small="false"
          :background="false"
          layout="total, prev, pager, next"
          :total="foolterScopedData.beReplied.length"
          @current-change="handleCurrentChange"
        />
      </div>

      <div v-if="!isBeRepliedComp" class="py-2 flex justify-between">
        <span class="text-xs flex-1">{{
          yearMonthDay(formatTime(foolterScopedData.time && foolterScopedData.time, "ymd_hms"))
        }}</span>
        <MainContentFooter
          @comment="() => ctxEmit('comment', scopedData)"
          style="flex: 2"
          :size="14"
          :info="unref(comment_footerInfo)(deepProps())"
          class="footerIcon"
        />
      </div>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { PropType, unref, computed, ref } from "vue";

import { formatTime } from "../../../../../utils/filterDate";
import { comment_footerInfo } from "../../../../subscription/methods";

import CommentItem from "./CommentItem.vue";
import { ElAvatar, ElCol, ElRow, ElPagination } from "element-plus";
import MainContentFooter from "../../../../subscription/components/MainContentFooter.vue";
import { fromPlayCount } from "../../../../../utils/fromPlayCount";

const ctxEmit = defineEmits(["linke", "comment", "forward"]);

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

const openReplyAll = ref(false);
const currentPage = ref(1);

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

function deepProps() {
  const deep = JSON.parse(JSON.stringify(props));

  deep.likedCount = fromPlayCount(deep.scopedData.likedCount);
  deep.commentCount = deep.scopedData.beReplied.length;
  deep.liked = deep.scopedData.linke;

  return deep;
}

function toHomePageOption() {
  return {
    path: "/user/home",
    query: {
      uid:
        foolterScopedData.value &&
        foolterScopedData.value.user &&
        foolterScopedData.value.user.userId,
      isself: true,
    },
  };
}

function handleCurrentChange(index: number) {
  console.log(index);
}

const foolterScopedData = computed<any>(() => props.scopedData);
const beRepliedData = computed(() => {
  return openReplyAll.value
    ? foolterScopedData.value.beReplied.slice(currentPage.value, 10)
    : foolterScopedData.value.beReplied.slice(0, 3);
});
</script>
<style scoped lang="scss">
.footerIcon {
  &:deep(div:nth-child(1)) {
    width: 85%;

    & > div > div:nth-last-child(1) {
      width: inherit;
    }

    & > div > div {
      padding: 0;
    }
  }
}

.hover {
  &:hover {
    color: #409eff;
    text-decoration: underline;
  }
}
</style>
