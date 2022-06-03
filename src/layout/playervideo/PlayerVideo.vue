<template>
  <el-container class="w-full h-full">
    <el-container>
      <el-container class="h-full relative scrollltrack">
        <el-main style="width: 69.5vw" class="h-full absolute top-0 left-0 scrollltrack">
          <better-scroll :open-h-render="false" class="h-full">
            <div class="root" ref="videobox" style="height: 84vh">
              <div ref="video" class="xgplayer-skin-customplay"></div>
            </div>
            <video-info :videoinfo="videoinfo" />
            <CommentArea
              v-if="Object.keys(videoinfo).length > 0"
              :video-and-user-info="videoinfo"
            />
            <div class="py-10"></div>
          </better-scroll>
        </el-main>
      </el-container>
    </el-container>
    <el-aside style="width: 30.5vw" class="h-full">
      <el-main class="h-full" style="padding: 16px 0 !important">
        <asaync-suspense>
          <better-scroll>
            <video-lists />
          </better-scroll>
        </asaync-suspense>
      </el-main>
    </el-aside>
  </el-container>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

import playerVideo from "../../common/videoplayer";
import { mvVideoDetail, mvPath } from "../../api/playervideo";
import { videoinfodata, VIDEO_INFO } from ".";

import { ElContainer, ElMain, ElAside } from "element-plus";
import VideoLists from "./components/VideoLists.vue";
import VideoInfo from "./components/VideoInfo.vue";
import BetterScroll from "../../components/betterscroll/BetterScroll.vue";
import AsayncSuspense from "../../components/suspense/AsayncSuspense.vue";
import CommentArea from "../../components/commentarea/CommentArea.vue";

const route = useRoute();
const mvid = Number(route.query.id);

const ratio = ref([]);
const mvurl = ref("");
const video = ref(null);
const videobox = ref(null);
let poster = "";

//@ts-ignore
const videoinfo = ref<VIDEO_INFO>({});

mvVideoDetail(mvid)
  .then((sources) => sources.data)
  .then(async (videodata) => {
    console.log(videodata);

    const id = videodata.data.id;
    const brs = videodata.data.brs;
    const r = brs[brs.length - 1];
    ratio.value = brs;
    poster = videodata.data.cover;
    const mvurldata = await mvPath(id, r.br);

    mvPlayPath(mvurldata.data.data);
    videoinfo.value = videoinfodata(videodata.data);
    console.log(videoinfo.value);
  })
  .catch((err) => {
    console.log("mvVideoDetail接口发生错误:" + err);
  });

function videoComment() {}

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

onMounted(async () => {
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
