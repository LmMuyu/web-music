<template>
  <div class="py-4">
    <div class="titletext">{{ videoinfo.videoname }}</div>
    <div class="videoinfo">{{ videoinfo.playcount }} • {{ videoinfo.createtime }}</div>
  </div>
  <div class="w-full" style="border: 1px solid #e5e5e5"></div>
  <div class="py-4">
    <div class="flex">
      <div class="px-4 flex" v-for="(nicknameinfo, index) in videoinfo.artistNames" :key="index">
        <el-avatar :src="nicknameinfo.img1v1Url" :size="48"> </el-avatar>
        <div class="pl-4">
          <router-link :to="{ path: '/user/home', query: { uid: nicknameinfo.id } }">
            <span class="block nickname"> {{ nicknameinfo.name }} </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="py-6 pb-8 transform-gpu translate-x-20">
      {{ videoinfo.title }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";

import { ElAvatar } from "element-plus";

import type { VIDEO_INFO } from "../";

const props = defineProps({
  videoinfo: {
    type: Object as PropType<VIDEO_INFO>,
    required: true,
  },
});

console.log(props.videoinfo);
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
</style>
