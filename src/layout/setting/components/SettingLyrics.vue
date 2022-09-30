<template>
  <div>
    <div class="py-4 text-sm">信息</div>
    <div>
      <div class="font-bolb py-4 flex items-center">
        <span class="text-xs" style="color: #73767a"> 类型: </span>
      </div>
      <Radio
        :radio-options="lyricsType.player"
        :uncheck="true"
        v-model:model-radio="lyricsType.type"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, toRaw } from "vue";
import { watchSettingUpdate } from "../hook";
import Radio from "./Radio.vue";

const lyricsType = reactive({
  type: "1",
  player: toRaw([
    {
      title: "桌面歌词",
      label: "1",
    },
    {
      title: "网页歌词",
      label: "2",
    },
  ]),
});
watchSettingUpdate(lyricsType);
</script>
<style scoped lang="scss"></style>
