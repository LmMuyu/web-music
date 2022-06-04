<template>
  <div class="py-4 px-2">
    <div class="titletext">{{ videoinfo.videoname }}</div>
    <div class="videoinfo flex items-center">
      <font-icon class="videoinfo" icon="iconbofang1">
        <template #after>
          <span class="pl-2 text-sm">{{ videoinfo.playcount }} </span>
        </template>
      </font-icon>
      <span class="px-2 text-sm">•</span>
      <span class="text-sm">{{ videoinfo.createtime }}</span>
    </div>
  </div>
  <div class="w-full" style="border: 1px solid #e5e5e5"></div>
  <div class="py-4">
    <div class="flex justify-around">
      <video-author
        v-if="Object.keys(videoinfo).length > 0"
        :videoAndUserInfo="videoinfo"
      ></video-author>
      <subscribe
        @follow="subscribeFollow"
        :subscribe="isFollow(videoinfo.artistNames[0].id)"
        :authorid="videoinfo.artistNames[0].id"
      ></subscribe>
    </div>
    <div class="pl-20" v-if="videoinfo.title">
      <div
        ref="titlebox"
        style="color: rgba(24, 24, 27, 1)"
        class="text-sm"
        :class="watchTitleBoxHeight && 'linex'"
      >
        {{ videoinfo.title }}
      </div>
      <div v-if="!anAllTitle" class="py-2 text-sm">
        <a @click="anAllAndPackupTitle" style="color: #409eff" href="javascript:void(;;)">展开</a>
      </div>
      <div v-else="anAllTitle" class="py-2 text-sm">
        <a @click="anAllAndPackupTitle" style="color: #409eff" href="javascript:void(;;)">收起</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, PropType, ref } from "vue";

import { isFollow } from "../../user/hooks";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import VideoAuthor from "../../../components/commentarea/CommentArea.vue";
import Subscribe from "../../../components/subscribe/Subscribe.vue";

import type { VIDEO_INFO } from "../";
import { followUser } from "../../../api/playervideo";

enum FollowInfo {
  "yesFollow",
  "noFollow",
}

const props = defineProps({
  videoinfo: {
    type: Object as PropType<VIDEO_INFO>,
    required: true,
  },
});

const watchTitleBoxHeight = ref(false);
const anAllTitle = ref(false);
const titlebox = ref(null);
let linexPreHeight = ref(0);

console.log(props.videoinfo);

function anAllAndPackupTitle() {
  anAllTitle.value = !anAllTitle.value;
  watchTitleBoxHeight.value = !watchTitleBoxHeight.value;
}

async function subscribeFollow([follow, followid]) {
  console.log(follow, followid);

  const followRes = await followUser(
    follow as FollowInfo.noFollow | FollowInfo.yesFollow,
    followid
  );
  console.log(followRes);
}

onMounted(async () => {
  await nextTick();
  if (titlebox.value) {
    const beforeOffsetHeight = titlebox.value.offsetHeight;
    beforeOffsetHeight && (linexPreHeight.value = beforeOffsetHeight);
    watchTitleBoxHeight.value = true;

    await nextTick();
    const afterOffsetHeight = titlebox.value.offsetHeight;
    afterOffsetHeight && afterOffsetHeight > linexPreHeight.value && (anAllTitle.value = true);
  }
});
</script>
<style scoped lang="scss">
@mixin Text_Css($size, $lhight, $weight: 500) {
  font-family: "Inter";
  font-style: normal;
  font-weight: $weight;
  font-size: $size +#{px};
  line-height: $lhight +#{px};
}

.titletext {
  @include Text_Css(18, 28);
  display: flex;
  align-items: center;
}

.videoinfo {
  @include Text_Css(18, 28, 400);
  display: flex;
  align-items: center;
  color: #6b7280;
}

.nickname {
  @include Text_Css(14, 20);
  color: #18181b;
}

.title_abstract {
  @include Text_Css(14, 20, 400);
  color: #18181b;
}

.linex {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
</style>
