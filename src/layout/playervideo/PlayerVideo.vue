<template>
  <el-container class="w-full h-full">
    <el-container>
      <el-container class="h-full relative scrollltrack">
        <el-main style="width: 69.5vw" class="h-full absolute top-0 left-0 scrollltrack">
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
            />
          </better-scroll>
        </el-main>
      </el-container>
    </el-container>
    <el-aside style="width: 30.5vw" class="h-full">
      <el-main class="h-full" style="padding: 0px !important ; padding: 20px 20px 20px 0">
        <asaync-suspense>
          <better-scroll :item-len="simiMvLists.length" :open-h-render="false">
            <video-lists v-for="simimv in simiMvLists" :key="simimv.id" :mvorvideo="simimv">
            </video-lists>
          </better-scroll>
        </asaync-suspense>
      </el-main>
    </el-aside>
  </el-container>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";

import playerVideo from "../../common/videoplayer";
import { mvVideoDetail, mvPath, simiMv } from "../../api/playervideo";
import { videoinfodata, VIDEO_INFO } from ".";

import { ElContainer, ElMain, ElAside } from "element-plus";
import VideoInfo from "./components/VideoInfo.vue";
import BetterScroll from "../../components/betterscroll/BetterScroll.vue";
import AsayncSuspense from "../../components/suspense/AsayncSuspense.vue";
import VideoLists from "./components/VideoLists.vue";
import PlayerCommtentContainer from "../playlist/components/PlayListHistory/components/CommtentContainer.vue";
import { VideoComments } from "../../components/player";

enum COMP {
  "Comment" = "Comment",
}

const route = useRoute();
const videoId = Number(route.query.id);

const ratio = ref([]);
const mvurl = ref("");
const video = ref(null);
const videobox = ref(null);
const simiMvLists = ref([]);
const compvideo = ref<any>(null);
const better = ref(null);
let poster = "";

//@ts-ignore
const videoinfo = ref<VIDEO_INFO>({});
const mvCommentModule = new VideoComments("mv");
const commentModuleInfo = reactive({
  comments: [],
  total: 0,
});

mvVideoDetail(videoId)
  .then((sources) => sources.data)
  .then(async (videodata) => {
    // console.log(videodata);
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

simiMv(videoId).then((simimv) => {
  simiMvLists.value = simimv.data.mvs.map((mv) => videoinfodata(mv));
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

mvCommentModule.currentMusicPlayIndex(null, videoId);

let stop = watch(mvCommentModule.comments, async (lists) => {
  commentModuleInfo.comments.push(...lists);
  commentModuleInfo.total = lists.length;
  console.log(commentModuleInfo);

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
<style scoped lang="scss">
.scrollltrack {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
