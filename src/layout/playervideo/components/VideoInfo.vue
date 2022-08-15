<template>
  <div class="py-4 px-2">
    <div class="titletext">{{ videoinfo.videoname }}</div>
    <div class="videoinfo flex items-center py-2">
      <font-icon class="videoinfo" size="14" icon="iconbofang1">
        <template #after>
          <div class="flex items-center">
            <span class="text-xs pl-1">{{ videoinfo.playcount }} </span>
          </div>
        </template>
      </font-icon>
      <span class="px-2 text-xs">•</span>
      <span class="text-xs">发布：{{ videoinfo.createtime }}</span>
    </div>
    <div v-if="videoinfo.videoGroup && videoinfo.videoGroup.length > 0" class="flex items-center">
      <el-tag
        v-for="(group, index) in videoinfo.videoGroup"
        class="px-2 cursor-pointer"
        :class="index !== 0 && 'ml-2'"
        type="info"
        effect="plain"
        size="small"
        @click=""
        >{{ group.name }}</el-tag
      >
    </div>
  </div>
  <div class="w-full" style="border: 1px solid #e5e5e5"></div>
  <ElContainer>
    <ElHeader class="flex items-center">
      <video-author
        v-if="Object.keys(videoinfo).length > 0"
        :videoAndUserInfo="videoinfo"
        class="w-full py-4"
      ></video-author>
      <subscribe
        class="w-full flex justify-end"
        @follow="subscribeFollow"
        :subscribe="subscribe"
        :authorid="authorid"
      ></subscribe>
    </ElHeader>
    <ElMain v-if="videoinfo.title">
      <div
        ref="titlebox"
        style="color: rgba(24, 24, 27, 1); width: 40vw"
        :class="watchTitleBoxHeight && 'linex'"
        class="text-sm"
      >
        {{ videoinfo.title }}
      </div>
      <div class="py-2 text-sm">
        <a @click="anAllAndPackupTitle" style="color: #409eff" href="javascript:void(;;)">
          {{ anAllTitle ? "展开" : "收起" }}
        </a>
      </div>

      <div class="py-4">
        <el-button
          v-for="(other, key) in videoOtherInfo(videoinfo.otherinfo)"
          :key="key"
          @click="ctxEmit(otherIcon[key].event as 'collection' | 'linke' | 'share', key, videoinfo.otherinfo[`is${key}`])"
          class="flex items-center px-4"
          round
        >
          <FontIcon
            size="20"
            :color="videoinfo.otherinfo[`is${key}`] ? '#F56C6C' : ''"
            :icon="has(otherIcon, key) && otherIcon[key].icon"
          ></FontIcon>
          <span class="px-2"
            >{{
              `${
                videoinfo.otherinfo[`is${key}`] ? "已" + otherIcon[key].text : otherIcon[key].text
              }(${other})`
            }}
          </span>
        </el-button>
      </div>
    </ElMain>
  </ElContainer>
</template>
<script setup lang="ts">
import { computed, nextTick, PropType, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { has } from "lodash";

import { promptbox } from "../../../components/promptBox";
import { followUser } from "../../../api/playervideo";
import { isFollow } from "../../user/hooks";

import { ElTag, ElContainer, ElHeader, ElMain, ElButton } from "element-plus";
import VideoAuthor from "../../../components/commentarea/CommentArea.vue";
import Subscribe from "../../../components/subscribe/Subscribe.vue";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

import type { VIDEO_INFO } from "../";

enum FollowInfo {
  "yesFollow",
  "noFollow",
}

const ctxEmit = defineEmits(["collection", "linke", "share"]);

const props = defineProps({
  videoinfo: {
    type: Object as PropType<VIDEO_INFO>,
    required: true,
  },
});

const store = useStore();

const watchTitleBoxHeight = ref(false);
const anAllTitle = ref(false);
const titlebox = ref(null);
const subscribe = ref(false);
const otherIcon = {
  linke: {
    text: "赞",
    icon: "icondianzan_tuijian",
    event: "linke",
  },
  collection: {
    text: "收藏",
    icon: "iconshoucang",
    event: "collection",
  },
  share: {
    text: "分享",
    icon: "iconfenxiang",
    event: "share",
  },
};

class followReslut {
  handler: ((code: number, next: () => void) => void)[];
  index: number;
  msg: string;
  constructor(code: number, msg: string) {
    this.handler = [this.code201, this.code200];
    this.index = 0;
    this.msg = msg;

    this.dispatch(code, this.index);
  }

  dispatch(code: number, index: number) {
    if (index > this.handler.length) return;
    const that = this;
    return this.handler[this.index].call(that, code, () => this.dispatch(code, ++this.index));
  }

  code201(code: number, next: () => void) {
    if (code !== 201) return next();
    subscribe.value = false;
    promptbox({ title: this.msg, delay: 2500 });
  }

  code200(code: number, next: () => void) {
    if (code !== 200) return next();
    subscribe.value = true;
    promptbox({ title: this.msg, delay: 2500 });
  }
}

function anAllAndPackupTitle() {
  anAllTitle.value = !anAllTitle.value;
  watchTitleBoxHeight.value = !watchTitleBoxHeight.value;
}

async function subscribeFollow([follow, followid]) {
  const islogin = store.getters["login/getIslogin"];

  //有没有登录
  if (!islogin) {
    promptbox({ title: "请先登录！" });
    return;
  }

  const followRes = await followUser(
    followid,
    follow as FollowInfo.noFollow | FollowInfo.yesFollow
  );
  new followReslut(followRes.data.code, followRes.data.msg);
}

function setSubscribe() {
  watchEffect(() => {
    if (props.videoinfo?.artistNames?.[0].id) {
      subscribe.value = isFollow(props.videoinfo?.artistNames?.[0].id);
    }
  });
}

setSubscribe();

function videoOtherInfo(other: any) {
  const newother = {} as typeof otherIcon;

  for (const key in otherIcon) {
    if (has(other, key)) {
      newother[key] = other[key];
    }
  }

  return newother;
}

const authorid = computed(() => {
  return props.videoinfo?.artistNames?.[0].id || 0;
});

defineExpose({
  async tranBoxheight() {
    await nextTick();
    if (titlebox.value) {
      //没加省略号之前高度
      const beforeOffsetHeight = titlebox.value.offsetHeight;
      watchTitleBoxHeight.value = false;

      await nextTick();
      //加省略号之后高度
      const afterOffsetHeight = titlebox.value.offsetHeight;
      afterOffsetHeight && beforeOffsetHeight > afterOffsetHeight && (anAllTitle.value = false);
    }
  },
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
