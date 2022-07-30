<template>
  <div class="py-4 text-sm">播放</div>
  <div>
    <div class="font-bolb py-4 flex items-center">
      <span class="text-xs" style="color: #73767a"> 播放播放列表：</span>
      <span class="text-xs" style="color: #dedfe0"> 单曲、声音 </span>
    </div>
    <Radio :radio-options="playerlist.player" v-model:model-radio="playerlist.playlist" />
    <div>
      <span class="text-xs" style="color: #73767a"> 自动播放：</span>
    </div>
    <Radio
      :uncheck="true"
      :radio-options="automaticPlay.player"
      v-model:model-radio="automaticPlay.automatic"
    />
    <div>
      <span class="text-xs" style="color: #73767a"> 播放进度：</span>
    </div>
    <Radio
      :uncheck="true"
      :radio-options="broadcastPace.player"
      v-model:model-radio="broadcastPace.broadcastpace"
    />
    <div>
      <span class="text-xs" style="color: #73767a"> 效果：</span>
    </div>
    <Radio :uncheck="true" :radio-options="effect.player" v-model:model-radio="effect.effect" />

    <div>
      <span class="text-xs" style="color: #73767a"> 输出设备：指放下一首歌时生效 DirectSound </span>
    </div>

    <div class="py-2">
      <el-select v-model="outputdevices" placeholder="Select" size="small">
        <!-- <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      /> -->
      </el-select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toRaw, reactive, onUnmounted, ref } from "vue";

import Radio from "./Radio.vue";
import { ElSelect, ElOption } from "element-plus";

import type { radioOp } from "../type";
import { watchSettingUpdate } from "../hook";

const outputdevices = ref("");

const playerlist = reactive<{
  playlist: "1" | "2";
  player: radioOp[];
}>({
  playlist: "1",
  player: toRaw([
    {
      title: "双击播放单曲时，用当前单曲所在的歌曲列表替换播放列表声音同理）",
      label: "1",
    },
    {
      title: "双击指放单曲时，仅把当前单曲添加到到播放列表声音同理）",
      label: "2",
    },
  ]),
});

const automaticPlay = reactive({
  automatic: "1",
  player: toRaw([
    {
      title: "网页启动时自动指放",
      label: "1",
    },
  ]),
});

const broadcastPace = reactive({
  broadcastpace: "1",
  player: toRaw([
    {
      title: "程序启动时记住上一次播放进度",
      label: "1",
    },
  ]),
});

const effect = reactive({
  effect: "1",
  player: toRaw([
    {
      title: "开启音乐淡入淡出（仅支持输出设督 DirectSound )",
      label: "1",
    },
  ]),
});

const watchStop = watchSettingUpdate([playerlist, automaticPlay, broadcastPace, effect]);

function audioOutputDevices() {
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.log(devices);
  });
}

audioOutputDevices();

onUnmounted(() => {
  watchStop();
});
</script>

<style scoped lang="scss"></style>
