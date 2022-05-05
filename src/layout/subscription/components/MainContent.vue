<template>
  <el-container
    :style="{ backgroundColor: props.recursion ? '#f5f6fa' : '#fff' }"
    :class="recursion && 'px-6 pt-4 w-full h-full'"
  >
    <el-header>
      <MainContentHeader :type="eventType" :userinfo="event.user" :showTime="event.showTime" />
    </el-header>
    <el-main class="py-6" style="padding-top: 0; padding-bottom: 0">
      <main-song v-if="mainContentData.song" :song-data="mainContentData.song" />
      {{ mainContentData.msg }}
      <main-content-image-list :subinfo="event" @preImage="previewComp" />
      <main-website
        v-if="mainContentData.resource"
        :resource="mainContentData.resource"
      ></main-website>
    </el-main>
    <!-- <el-main v-if="mainContentData.event">
      <MainContent :event="mainContentData.event" />
    </el-main> -->
    <el-footer>
      <main-content-footer
        :info="footerInfo"
        :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
        @linke="linke"
        @comment="comment"
      />
    </el-footer>
  </el-container>
</template>

<script setup lang="tsx">
import { reactive, ref, unref } from "@vue/runtime-core";

import { musicResultDetail } from "../../../utils/musicDetail";
import { useRefNegate } from "../../../utils/useRefNegate";
import preview from "../../../components/previewpicture";
import { getComment } from "../../../api/subscription";
import { computed_footerInfo } from "../methods";
import { onLinke } from "../hooks/onLinke";

import { ElContainer, ElHeader, ElMain, ElFooter } from "element-plus";
import MainContentImageList from "./MainContentImageList.vue";
import MainContentHeader from "./MainContentHeader.vue";
import MainContentFooter from "./MainContentFooter.vue";
import MainContentText from "./MainContentText.vue";
// import MainWriteBox from "./MainWriteBox.vue";
import MainContent from "./MainContent.vue";
import MainWebsite from "./MainWebsite.vue";
import MainComment from "./MainComments";
import MainSong from "./MainSong.vue";

type infoMapValue = Map<string, Record<string, string | number>[]>;
type activityMap = Map<number, infoMapValue>;

const ctxEmit = defineEmits(["retPics"]);

const props = defineProps({
  event: {
    type: Object,
    default: () => {},
  },
  recursion: {
    type: Boolean,
    default: false,
  },
});

console.log(props.event);

const footerInfo = unref(computed_footerInfo)(props);
const { countRef, negate } = useRefNegate(false);
const eventType = ref(Number(event.type));
const commentList = ref([]);
const activityInfoMap = ref<activityMap>(new Map());

const mainContentData = reactive({
  event: null,
  song: null,
  msg: null,
  resource: null,
});

function linke(...emits: any) {
  onLinke(props.event, emits[0], emits[1] ? 0 : 1);
}

async function comment() {
  if (countRef.value || commentList.value.length > 0) return negate();

  const result = await getComment(props.event.info.threadId);
  commentList.value = result.data.comments;
  negate();
}

function previewComp(preindex: number) {
  const pics = props.event.pics;
  const previewcomp = new preview(pics, preindex);
}

const runDataKeyFn: Record<string, (...arg) => void> = {
  song(data: any) {
    mainContentData.song = musicResultDetail(data);
  },
  msg(mess: string) {
    if (mess) {
      mainContentData.msg = mess;
    }
  },
  event(eventdata: any) {
    mainContentData.event = eventdata;
  },
  resource(data: any) {
    mainContentData.resource = data;
  },
};

function jsonTransform() {
  const parseTojson = JSON.parse(props.event.json);
  console.log(parseTojson);

  Object.keys(mainContentData).forEach((mainkey) => {
    if (Object.prototype.hasOwnProperty.call(parseTojson, mainkey)) {
      runDataKeyFn[mainkey].call(null, parseTojson[mainkey]);

      if (mainkey === "resource") {
        eventType.value = 99;
      }
    }
  });
}

jsonTransform();

function activityInfos() {
  if (!props?.event?.bottomActivityInfos) {
    return console.warn("props.event：Null");
  }

  const bottomActivityInfos = props.event.bottomActivityInfos as Record<string, any>[];
  const typeMethods = {
    1: "One",
    2: "Two",
  };

  const activeityInfoMethods = {
    typeOne(target: string) {
      const index = target.indexOf("?");
      if (index != -1) {
        const splitStrArr = target.slice(index + 1).split("=");

        return splitStrArr;
      } else {
        console.warn("无法截取，index为：" + index);
      }
    },

    typeTwo(target: string) {
      const index = target.indexOf("//");

      if (index != -1) {
        const splitStrArr = target.slice(index + 1).split("/");

        return splitStrArr;
      }
    },
  };

  bottomActivityInfos.forEach((activeInfo) => {
    const methodName = typeMethods[activeInfo.type];
    console.log(methodName);

    if (activeInfo.target && methodName) {
      const [page, id] = activeityInfoMethods[`type${methodName}`](activeInfo?.target ?? "");
      // setActiveInfos(activeInfo, page, id);
    } else {
      console.warn(activeInfo.target + "===" + methodName);
    }
  });
}

activityInfos();

function setActiveInfos(activeInfo: any, page: string, id: number) {
  if (activityInfoMap.value.has(activeInfo.type)) {
    const activityInfoKey = activityInfoMap.value.get(activeInfo.type);

    if (activityInfoKey.has(activeInfo.name.trim())) {
      activityInfoKey.get(activeInfo.name.trim()).push({ page, id });
      activityInfoMap.value.set(activeInfo.type, activityInfoKey);
    } else {
      activityInfoKey.set(activeInfo.name.trim(), [{ page, id }]);
    }
  } else {
    activityInfoMap.value.set(
      activeInfo.type,
      new Map().set(activeInfo.name.trim(), [{ page, id }])
    );
  }
}

// const newEventJson = computed(() => {
//   return props.recursion
//     ? {
//         msg: `<a herf="jacascript:void(;;)" data-id="${
//           props.event.user.userId ?? props.event.user.uid
//         }" style="color:#74b9ff" class="user hover_init cursor-pointer">@${
//           props.event.user.nickname
//         }</a>  ${eventType.value(props.event.type)}：${parseJson.value["msg"]}`,
//       }
//     : {};
// });
</script>

<style scoped lang="scss"></style>
