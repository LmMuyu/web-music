<template>
  <el-container style="height: 100vh" class="w-full">
    <el-container>
      <el-container class="h-full bg-white">
        <el-header height="50px" class="flex items-center">
          <div class="flex items-center" @click="router.go(-1)">
            <font-icon icon="iconarrow-right-copy" size="22"></font-icon>
            <span class="font-bold">{{ queryIsVid ? "视频" : "MV" }}详情</span>
          </div>
        </el-header>
        <el-main style="width: 69.5vw; padding-top: 0; overflow: hidden" class="h-full">
          <better-scroll ref="better" @hook:update="update" :open-h-render="false" class="h-full">
            <div class="root" ref="videobox" style="height: 84vh">
              <div ref="video" class="xgplayer-skin-customplay"></div>
            </div>
            <video-info ref="compvideo" :videoinfo="videoinfo" />
            <player-commtent-container
              title="精彩评论"
              :size="10"
              :total="commentModuleInfo.total"
              :data="commentModuleInfo.comments"
              :comp-id="COMP.Comment"
              :loading="false"
              :renderBS="false"
              :ismainhidden="true"
            />
          </better-scroll>
        </el-main>
      </el-container>
    </el-container>
    <el-aside style="width: 30.5vw; overflow: inherit" class="h-auto bg-white">
      <asaync-suspense>
        <el-header height="50px" class="flex items-center" style="padding: 0">
          <span class="font-bold">相关推荐</span>
        </el-header>
        <better-scroll :open-h-render="false">
          <video-lists
            :isVideo="queryIsVid"
            v-for="simimv in simiMvLists"
            :key="simimv.id"
            :mvorvideo="simimv"
          >
          </video-lists>
        </better-scroll>
      </asaync-suspense>
    </el-aside>
  </el-container>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { nextTick, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from "vue";

import { videoinfodata, VIDEO_INFO } from ".";
import playerVideo from "../../common/videoplayer";
import { VideoComments } from "../../components/player";
import { mvVideoDetail, mvPath, simiMv, playerVideoPath, allvideo } from "../../api/playervideo";

import VideoInfo from "./components/VideoInfo.vue";
import VideoLists from "./components/VideoLists.vue";
import FontIcon from "../../components/fonticon/FontIcon.vue";
import { ElContainer, ElMain, ElAside, ElHeader } from "element-plus";
import BetterScroll from "../../components/betterscroll/BetterScroll.vue";
import AsayncSuspense from "../../components/suspense/AsayncSuspense.vue";
import PlayerCommtentContainer from "../playlist/components/PlayListHistory/components/CommtentContainer.vue";

enum COMP {
  "Comment" = "Comment",
}

let poster = "";

const ratio = ref([]);
const mvurl = ref("");
const video = ref(null);
const route = useRoute();
const better = ref(null);
const router = useRouter();
const videobox = ref(null);
const simiMvLists = ref([]);
const compvideo = ref<any>(null);
const videoId = Number(route.query.id) || route.query.vid;
const queryIsVid = Object.prototype.hasOwnProperty.call(route.query, "vid");

//@ts-ignore
const videoinfo = ref<VIDEO_INFO>({});
const mvCommentModule = new VideoComments(queryIsVid ? "video" : "mv");
const commentModuleInfo = reactive({ comments: [], total: 0 });

mvVideoDetail(videoId as number | string, queryIsVid ? "vid" : "mid")
  .then((sources) => sources.data)
  .then(queryIsVid ? vidSourcessFn : midSourcessFn)
  .catch((err) => {
    console.error(err);
  });

async function midSourcessFn(videodata: any) {
  const id = videodata.data.id;
  const brs = videodata.data.brs;
  const r = brs[brs.length - 1];
  ratio.value = brs;
  poster = videodata.data.cover;
  const mvurldata = await mvPath(id, r.br);

  mvOrVideoPlayPath(mvurldata.data.data);
  videoinfo.value = videoinfodata(videodata.data);
}

async function vidSourcessFn(videodata: any) {
  ratio.value = videodata.data.resolutions;
  videoinfo.value = videoinfodata(videodata.data);
  mvOrVideoPlayPath((await playerVideoPath(videoId as string)).data.urls[0]);
}

if (!queryIsVid) {
  simiMv(videoId as number).then((simimv) => {
    simiMvLists.value = simimv.data.mvs.map((mv) => videoinfodata(mv));
  });
} else {
  allvideo(videoId as string).then((simiVideo) => {
    simiMvLists.value = simiVideo.data.data.map((video) => videoinfodata(video));
  });
}

function mvOrVideoPlayPath(data: Record<string, any>) {
  mvurl.value = data.url;
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

let timer = null;

async function update() {
  await nextTick();
  if (compvideo.value) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      compvideo.value.tranBoxheight();
    }, 0);
  }
}

mvCommentModule.currentMusicPlayIndex(null, videoId as number | string);

let stop = watch(mvCommentModule.comments, async (lists) => {
  commentModuleInfo.comments.push(...lists);
  commentModuleInfo.total = lists.length;

  await nextTick();
  better.value.scrollHeightRefresh();
});

onMounted(async () => {
  playerVideoFn();
});

onUnmounted(() => {
  stop();
  stop = null;
});
</script>
<style scoped lang="scss"></style>
