<template>
  <el-row class="flex items-start my-2 px-2" v-for="(mvorvideo, index) in videolists" :key="index">
    <el-col :span="10">
      <div class="relative" style="height: 15vh">
        <el-image class="w-full h-full" fit="fill" :src="mvorvideo.poster"> </el-image>
        <span class="absolute right-2 bottom-2 z-10 duration time_text">
          {{ mvorvideo.duration }}
        </span>
        <router-link
          class="absolute top-0 left-0 w-full h-full"
          :to="{ path: '/video', query: { id: mvorvideo.vid, type: typefnstr } }"
          target="_blank"
        ></router-link>
      </div>
    </el-col>
    <el-col :span="14" class="flex flex-col justify-start px-2">
      <span class="videoname"> {{ mvorvideo.videoname }} </span>
      <span class="nickname"> {{ mvorvideo.nickname }} </span>
      <div class="inline-flex items-center videoinfo">
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
import { ref } from "vue";
import { useRoute } from "vue-router";

import { videoinfodata, VIDEO_INFO } from "..";
import { personalizedMv, timelineVideo } from "../../../api/playervideo";

import { ElImage, ElRow, ElCol } from "element-plus";
import FontIcon from "../../../components/fonticon/FontIcon.vue";

const route = useRoute();
const videolists = ref<VIDEO_INFO[]>([]);
let videooffset = 10;

const typefnstr = (route.query.type ?? "mv") as string;

function recommend(type: string) {
  const typefn = {
    mv: personalizedMv,
    video: timelineVideo,
  };

  return typefn[type] ?? typefn.mv;
}

try {
  const sources = await recommend(typefnstr)(videooffset);
  console.log(sources);

  videolists.value = sources.data.result.map((data) => videoinfodata(data));
} catch (error) {
  console.log(error);
}
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
</style>
