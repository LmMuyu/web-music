<template>
  <el-container class="w-full h-full">
    <el-container>
      <el-container class="h-full">
        <el-main class="w-full h-full scrollltrack">
          <div class="w-full" style="height: 1px"></div>
          <better-scroll>
            <div class="root" ref="videobox" style="height: 84vh">
              <div ref="video"></div>
            </div>
            <video-info :videoinfo="videoinfo" />
          </better-scroll>
        </el-main>
      </el-container>
      <el-aside style="width: 26.8vw" class="h-full">
        <el-main class="h-full">
          <better-scroll> <video-lists /> </better-scroll>
        </el-main>
      </el-aside>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import playerVideo from "../../common/videoplayer";
import { mvVideoDetail, mvPath, personalizedMv, timelineVideo } from "../../api/playervideo";

import { ElContainer, ElMain, ElAside } from "element-plus";
import VideoLists from "./components/VideoLists.vue";
import VideoInfo from "./components/VideoInfo.vue";
import { videoinfodata, VIDEO_INFO } from ".";
import BetterScroll from "../../components/betterscroll/BetterScroll.vue";
import { AxiosPromise } from "axios";

const route = useRoute();
const mvid = Number(route.query.id);
const typefnstr = (route.query.type ?? "mv") as string;

const ratio = ref([]);
const mvurl = ref("");
const video = ref(null);
const videobox = ref(null);
let poster = "";

//@ts-ignore
const videoinfo = ref<VIDEO_INFO>({});

function recommend(type: string): AxiosPromise<any> {
  const typefn = {
    mv: personalizedMv,
    video: timelineVideo,
  };

  return typefn[type] ?? typefn.mv;
}

recommend(typefnstr)();

mvVideoDetail(mvid)
  .then((sources) => sources.data)
  .then(async (videodata) => {
    const id = videodata.data.id;
    const brs = videodata.data.brs;
    const r = brs[brs.length - 1];
    ratio.value = brs;
    poster = videodata.data.cover;
    const mvurldata = await mvPath(id, r.br);

    mvPlayPath(mvurldata.data.data);
    videoinfo.value = videoinfodata(videodata.data);
  })
  .catch((err) => {
    console.log("mvVideoDetail接口发生错误:" + err);
  });

function mvPlayPath(data: Record<string, any>) {
  const videourl = data.url;
  mvurl.value = videourl;
}

function playerVideoFn() {
  watchEffect(() => {
    if (mvurl.value && video.value && videobox.value) {
      nextTick(() => {
        const videoplaye = new playerVideo(mvurl.value, video.value, {
          poster,
        });
        videoplaye.windowsize(videobox.value.offsetWidth, videobox.value.offsetHeight);
      });
    }
  });
}

onMounted(() => {
  playerVideoFn();
});
</script>
<style scoped lang="scss">
.scrollltrack {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
