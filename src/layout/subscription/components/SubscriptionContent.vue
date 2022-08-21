<template :root="true">
  <div ref="section" class="relative h_calc" :class="class">
    <better-scroll
      v-if="countRef"
      :open-h-render="false"
      :open-upload="true"
      :item-len="dynamics.length"
      :isminusviewposth="true"
      @pull-up-load="loadData"
    >
      <slot></slot>
      <el-row class="flex pt-4" v-for="dynamic in dynamics" :key="dynamic.id">
        <el-col :span="2" class="flex justify-center">
          <el-avatar
            class="cursor-pointer"
            :size="42"
            :src="dynamic.dynamicuser.avatarUrl + '?param=42y42'"
            @click="toUserPage(dynamic.dynamicuser)"
          >
          </el-avatar>
        </el-col>
        <el-col :span="22">
          <MainContent @clickComment="clickComment" :dynamic="dynamic">
            <template v-slot:recursion="{ defualt }">
              <MainContent
                :recursion="true"
                @clickComment="clickComment"
                :dynamic="new DynamicEvent(defualt)"
              >
              </MainContent>
            </template>
          </MainContent>
        </el-col>
      </el-row>
    </better-scroll>
    <div v-else class="h-full w-full">
      <Loading></Loading>
    </div>

    <el-dialog
      :ref="(ref) => (dialognode = ref)"
      custom-class="subscriptioncontent_container"
      :show-close="false"
      v-model="dialogTableVisible"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="flex items-center justify-between">
          <h5 :id="titleId" :class="titleClass">动态评论</h5>
          <font-icon icon="iconclose" @click="dialogClose(close)"> </font-icon>
        </div>
      </template>
      <div v-if="loading">
        <CommentItem
          v-for="(comment, index) in comments"
          :key="index"
          :scopedData="comment"
        ></CommentItem>
      </div>
      <div v-else style="height: 55vh" class="w-full flex justify-center items-center">
        <Loading></Loading>
      </div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { getSubScriptDynamic } from "../../../api/subscription";
import { useRefNegate } from "../../../utils/useRefNegate";
import { getComment } from "../../../api/subscription";
import { DynamicEvent } from "../methods";

import CommentItem from "../../playlist/components/PlayListHistory/components/CommentItem.vue";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import Loading from "../../../components/svgloading/SvgLoading.vue";
import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { ElAvatar, ElRow, ElCol, ElDialog } from "element-plus";
import MainContent from "./MainContent.vue";

const props = defineProps({
  event: Array,
  class: String,
  isPullUpData: {
    type: Boolean,
    default: true,
  },
});

let dialognode = null;
const router = useRouter();
const { countRef, negate } = useRefNegate(false);
const { countRef: loading, negate: loadingNegate } = useRefNegate(false);
const { countRef: dialogTableVisible, negate: visibleNegate } = useRefNegate(false);

//@ts-ignore
const dynamics = ref<DynamicEvent[]>([]);
const section = ref<HTMLElement | null>(null);
const comments = ref([]);
let lasttime = 0;

let watchStop = null;

function dialogClose(close) {
  close();
  visibleNegate();
}

function toUserPage(event: any) {
  router.push({ path: "/user/home", query: { uid: event.user.userId } });
}

async function clickComment(event: DynamicEvent) {
  loading.value = false;
  visibleNegate();
  setDialogMaxHeight();
  const reqComment = await getComment(event.otherinfo.commentId);
  comments.value = reqComment.data.comments;
  loadingNegate();
}

function setDialogMaxHeight() {
  console.log(dialognode);
}

async function friend(requestTime: number = -1) {
  try {
    const res = await getSubScriptDynamic(requestTime);
    lasttime = res.data.lasttime;
    dynamics.value.push(...res.data.event.map((dynamic) => new DynamicEvent(dynamic)));
    return true;
  } catch (err) {
    //导航到404页面
    console.log(err);
  }
}

if (!props.event) {
  friend().then(negate);
} else {
  watchEvents();
}

function watchEvents() {
  if (watchStop) {
    watchStop();
    watchStop = null;
  }

  watchStop = watchEffect(() => {
    if (props.event && props.event.length > 0) {
      countRef.value = true;
      dynamics.value = props.event.map((dynamic) => new DynamicEvent(dynamic));
    }
  });
}

async function loadData([resolve, reject]) {
  friend(lasttime);
  resolve(true);
}
</script>
<style scoped lang="scss">
.h_calc {
  height: calc(100% - 40px);
}

.container {
  height: 75vh;

  &:deep(.el-dialog__body) {
    height: 75vh;
  }
}
</style>
