<template>
  <div class="py-4 text-sm">信息</div>
  <div>
    <div class="font-bolb py-4 flex items-center">
      <span class="text-xs" style="color: #73767a"> 私信：</span>
      <span class="text-xs" style="color: #dedfe0"> 接受私信提醒 </span>
    </div>
    <Radio :radio-options="directMessages.player" v-model:model-radio="directMessages.direct" />

    <div class="font-bolb py-4 flex items-center">
      <span class="text-xs" style="color: #73767a"> 通知: </span>
    </div>
    <div class="flex flex-col">
      <Radio
        v-for="(notice, index) in usernotice"
        :key="index"
        :radio-options="notice.player"
        :uncheck="true"
        v-model:model-radio="notice.notice"
      />
    </div>
    <div class="font-bolb py-4 flex items-center">
      <span class="text-xs" style="color: #73767a"> 我的听歌排行: </span>
    </div>
    <div class="flex flex-col">
      <Radio
        :radio-options="musicRanking.player"
        :uncheck="true"
        v-model:model-radio="musicRanking.ranking"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, toRaw, onUnmounted } from "vue";

import { watchSettingUpdate } from "../hook";

import Radio from "./Radio.vue";

const directMessages = reactive({
  direct: "1",
  player: toRaw([
    {
      title: "所有人",
      label: "1",
    },
    {
      title: "我所关注的人",
      label: "2",
    },
  ]),
});

const usernotice = ref([
  {
    notice: "1",
    player: toRaw([
      {
        title: "歌单被收藏",
        label: "1",
      },
    ]),
  },
  {
    notice: "1",
    player: toRaw([
      {
        title: "收到赞",
        label: "1",
      },
    ]),
  },
  {
    notice: "1",
    player: toRaw([
      {
        title: "新粉丝",
        label: "1",
      },
    ]),
  },
]);

const musicRanking = reactive({
  ranking: "1",
  player: toRaw([
    {
      title: "所有人可见",
      label: "1",
    },
    {
      title: "我关注的人科技",
      label: "2",
    },
    {
      title: "仅自己可见",
      label: "3",
    },
  ]),
});

const settingUpdate = watchSettingUpdate([directMessages, usernotice, musicRanking]);

onUnmounted(() => {
  settingUpdate();
});
</script>
<style scoped lang="scss"></style>
