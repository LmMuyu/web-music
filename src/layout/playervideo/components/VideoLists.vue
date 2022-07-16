<template>
  <el-row class="flex items-start py-1">
    <el-col :span="10">
      <div class="relative" style="height: 15vh">
        <el-image class="w-full h-full" fit="fill" :src="mvorvideo.cover"> </el-image>
        <span class="absolute right-2 bottom-2 z-10 duration time_text">
          {{ mvorvideo.duration }}
        </span>
        <router-link
          class="absolute top-0 left-0 w-full h-full"
          :to="{
            path: '/video',
            query: { [isVideo ? 'vid' : 'id']: mvorvideo.vid, type: isVideo ? 'video' : 'mv' },
          }"
          target="_blank"
        ></router-link>
      </div>
    </el-col>
    <el-col :span="14" class="flex flex-col justify-between h-full px-2">
      <span class="videoname py-1 dlinexx"> {{ mvorvideo.videoname }} </span>
      <span class="nickname py-1"> {{ mvorvideo.nickname }} </span>
      <div class="inline-flex items-center videoinfo py-1">
        <font-icon class="videoinfo" icon="iconbofang1">
          <template #after>
            <span>{{ mvorvideo.playcount }} </span>
          </template>
        </font-icon>
        <span class="px-2">•</span>
        <span>{{ mvorvideo.createtime }} </span>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { useRoute } from "vue-router";

import { VIDEO_INFO } from "..";

import { ElImage, ElRow, ElCol } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const props = defineProps({
  mvorvideo: {
    type: Object as PropType<VIDEO_INFO>,
    default: () => {},
  },
  isVideo: {
    type: Boolean,
    default: true,
  },
});

const route = useRoute();
</script>
<style scoped lang="scss">
@mixin Text_Css($size, $lhight, $weight: 500) {
  font-family: "Inter";
  font-style: normal;
  font-weight: $weight;
  font-size: $size +#{px};
  line-height: $lhight +#{px};
}

.videoname {
  @include Text_Css(14, 20, 500);
  color: #18181b;
}

.nickname {
  @include Text_Css(12, 16);
  color: #71717a;
}

.videoinfo {
  @include Text_Css(12, 16);
  color: #71717a;
}

.duration {
  @include Text_Css(12, 16);
  color: #fff;
  padding: 0px 2px;
  background: #000000;
  border-radius: 2px;
}

@include Dlinexx(2);
</style>
