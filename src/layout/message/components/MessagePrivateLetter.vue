<template>
  <better-scroll>
    <el-row
      class="flex w-full py-3 px-6 relative"
      v-for="(letter, index) in privateLetterList"
      :key="letter.fromUser.uid"
      @click.capture="
        // transitionOffset($event, toPath.bind(null, index, letter.fromUser.uid)),
        sendLetterUserInfo({
          avatar: letter.fromUser.avatar,
          nickname: letter.fromUser.nickname,
          uid: letter.fromUser.uid,
          lastTime: letter.lastTime,
        })
      "
    >
      <a href="javascript:void(;;)" class="absolute top-0 left-0 w-full h-full"></a>
      <el-col :span="4" class="flex items-center">
        <ElAvatar :src="letter.fromUser.avatar" />
      </el-col>
      <el-col :span="20" class="flex flex-col justify-between">
        <div class="py-2">
          <div class="w-full flex items-center justify-between">
            <span class="text-sm" style="color: #2f4154">
              {{ letter.fromUser.nickname }}
            </span>
            <span class="text-xs whitespace-nowrap">
              {{ letter.lastMsgTime }}
            </span>
          </div>
          <div class="w-full flex justify-between relative">
            <span
              :style="{ color: letter.newMsgCount > 0 ? '#556574' : '#a6aeb6' }"
              class="text-xs truncate text"
              >{{ letter.lastMsg["msg"] }}</span
            >
            <div
              v-if="!(letter.newMsgCount <= 0)"
              class="flex justify-cneter items-center text-xs w-4 h-4 rounded-xl p-1 text-white"
              style="background: #409eff"
            >
              <span :style="{ transform: `translateX(${spanLeft(letter.newMsgCount)})` }">
                {{ letter.newMsgCount }}
              </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </better-scroll>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useSlidingTrack } from "../../../utils/useSlidingTrack";
import { FocusTheUser } from "../hook/factory";

import { ElAvatar, ElRow, ElCol } from "element-plus";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";

import type { PropType } from "vue";
import type { SendLetterInfoEmit } from "../type";

const ctxEmit = defineEmits(["retNicknameInfo"]);

const props = defineProps({
  privateLetterList: {
    type: Array as PropType<FocusTheUser[]>,
    default: () => [],
  },
});

const router = useRouter();
const route = useRoute();

const track_slider = ref<HTMLElement | null>(null);
const ulList = ref<HTMLElement | null>(null);

const { initTrackPos, transitionOffset, getSliderTrack } = useSlidingTrack(track_slider.value, {
  direction: "vertical",
});

const sendLetterUserInfo = ({ avatar, lastTime, nickname, uid }: SendLetterInfoEmit) =>
  ctxEmit("retNicknameInfo", { uid, avatar, nickname, lastTime });

function toPath(index: number, uid: number) {
  router.push({
    path: "/message",
    query: {
      curindex: index,
      uid,
    },
  });
}

function spanLeft(count: number) {
  const countLen = String(count).length;
  return countLen >= 2 ? "-4px" : "0px";
}

onMounted(async () => {
  await nextTick();

  if (ulList.value && track_slider.value) {
    getSliderTrack(track_slider.value);
    initTrackPos(ulList.value, (route.query?.curindex as any) || 1);
  }
});
</script>
<style scoped lang="scss">
.bg_color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  color: #1f84cf;
  background-color: #e5f3fe;
}

.track::-webkit-scrollbar {
  display: none;
}

.text {
  margin: auto 0;
}

.width_track {
  & > .width_slider {
    width: inherit;
    background-color: #028bfa;
  }
}
</style>
