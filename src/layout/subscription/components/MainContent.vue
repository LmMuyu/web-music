<template>
  <el-container
    :style="{ backgroundColor: props.recursion ? '#f5f6fa' : '#fff' }"
    :class="recursion && 'px-6 pt-4 w-full h-full'"
  >
    <el-header>
      <MainContentHeader :type="eventType" :userinfo="event.user" :showTime="event.showTime" />
    </el-header>
    <el-main class="py-6" style="padding-top: 0; padding-bottom: 0" v-if="hiddenMain">
      <span class="cursor-text text-sm font-medium" ref="content_text"></span>
      <main-song v-if="mainContentData.song" :song-data="mainContentData.song" />
      <main-content-image-list :subinfo="event" @preImage="previewComp" />
      <main-website
        v-if="mainContentData.resource"
        :resource="mainContentData.resource"
      ></main-website>
    </el-main>
    <el-main v-if="mainContentData.event && !hiddenMain">
      <MainContent :event="mainContentData.event" :recursion="true" />
    </el-main>
    <el-footer height="40px">
      <main-content-footer
        :info="footerInfo"
        :latestLikedUsers="event.info.commentThread.latestLikedUsers ?? []"
        @linke="linke"
        @comment="comment"
        @forward="forward"
      />
    </el-footer>
  </el-container>
</template>

<script setup lang="tsx">
import { onMounted, reactive, ref, unref } from "@vue/runtime-core";

import { musicResultDetail } from "../../../utils/musicDetail";
import { useRefNegate } from "../../../utils/useRefNegate";
import preview from "../../../components/previewpicture";
import { getComment } from "../../../api/subscription";
import { computed_footerInfo, msgRender } from "../methods";
import { onLinke } from "../hooks/onLinke";

import { ElContainer, ElHeader, ElMain, ElFooter } from "element-plus";
import MainContentImageList from "./MainContentImageList.vue";
import MainContentHeader from "./MainContentHeader.vue";
import MainContentFooter from "./MainContentFooter.vue";
import MainContentText from "./MainContentText.vue";
// import MainWriteBox from "./MainWriteBox.vue";
import MainContent from "./MainContent.vue";
import MainWebsite from "./MainWebsite.vue";
import MainSong from "./MainSong.vue";

type infoMapValue = Map<string, { query: string; id: number }>;
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

const footerInfo = unref(computed_footerInfo)(props);
const { countRef, negate } = useRefNegate(false);
const eventType = ref(Number(event.type));
const commentList = ref([]);
const activityInfoMap = ref<activityMap>(new Map());
const activitySetLists = new Set<infoMapValue>();
const content_text = ref(null);

const mainContentData = reactive({
  event: null,
  song: null,
  msg: null,
  resource: null,
  program: null,
});

function linke(...emits: any) {
  console.log(emits);
  // onLinke(props.event, emits[0], emits[1] ? 0 : 1);
}

function withoutNull() {
  const hiddenMain = ref(false);

  for (const key in mainContentData) {
    const k = key as keyof typeof mainContentData;

    if (k === "event") {
      continue;
    }

    if (mainContentData[k] !== null) {
      hiddenMain.value = true;
      break;
    }
  }

  return hiddenMain;
}

async function comment() {
  if (countRef.value || commentList.value.length > 0) return negate();

  const result = await getComment(props.event.info.threadId);
  commentList.value = result.data.comments;
  negate();
}

function forward() {}

function previewComp(preindex: number) {
  const pics = props.event.pics;
  const previewcomp = new preview(pics, preindex);
}

function programData(data) {
  const song = data.mainSong && musicResultDetail(data.mainSong, data);
  // nicknameFalse(data, song);
  return { song };
}

function nicknameFalse(data, song) {
  console.log(song);
  console.log(data);
}

const runDataKeyFn: Record<string, (...arg) => void> = {
  song(data: any) {
    mainContentData.song = musicResultDetail(data);
  },
  msg(mess: string) {
    if (mess) {
      const textMsg = patcRouterLink(mess);
      mainContentData.msg = msgRender.bind(null, textMsg);
    }
  },
  event(eventdata: any) {
    mainContentData.event = eventdata;
  },
  resource(data: any) {
    mainContentData.resource = data;
  },
  program(data: any) {
    const { song } = programData(data);
    song && (mainContentData.song = song);
  },
};

function jsonTransform() {
  const parseTojson = JSON.parse(props.event.json);
  // console.log(parseTojson);

  Object.keys(mainContentData).forEach((mainkey) => {
    if (Object.prototype.hasOwnProperty.call(parseTojson, mainkey)) {
      runDataKeyFn[mainkey].apply(null, [parseTojson[mainkey], parseTojson]);

      if (mainkey === "resource") {
        eventType.value = 99;
      }
    }
  });
}

activityInfos();
jsonTransform();
const hiddenMain = withoutNull();
// console.log(props.event);

function sliceTextStr(msg: string, start: number, end: number) {
  const sliceLink = msg.slice(start, end);
  // console.log(sliceLink);

  activitySetLists.forEach((map) => {
    if (map.has(sliceLink)) {
      msg = msg.replace(
        `#${sliceLink}#`,
        `
        <router-link  class="bottom_line" style="color: rgb(116, 185, 255);" to="/topic?tid=${
          map.get(sliceLink).id
        }&topictitle=${sliceLink}">#${sliceLink}#</router-link>
      `
      );
    }
  });

  return msg;
}

function patcRouterLink(msg: string) {
  const len = msg.length;

  for (let i = 0; i < len; i++) {
    const str = msg[i];
    if (str === "#") {
      let j = ++i;

      while (j < len) {
        const endstr = msg[j];
        if (endstr === "#") {
          msg = sliceTextStr(msg, i, j);
          break;
        }
        j++;
      }
    } else {
      continue;
    }
  }

  return msg;
}

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
        return splitStrArr[0];
      } else {
        console.warn("无法截取，index为：" + index);
      }
    },

    typeTwo(target: string) {
      const index = target.indexOf("//");

      if (index != -1) {
        const splitStrArr = target.slice(index + 1).split("/");
        return splitStrArr[1];
      }
    },
  };

  bottomActivityInfos.forEach((activeInfo) => {
    const methodName = typeMethods[activeInfo.type];

    if (activeInfo.target && methodName) {
      const query = activeityInfoMethods[`type${methodName}`](activeInfo?.target ?? "");
      setActiveInfos(activeInfo, query, activeInfo.id);
    } else {
      console.warn(activeInfo.target + "===" + methodName);
    }
  });
}

function setActiveInfos(activeInfo: any, query: string, id: number) {
  activityInfoMap.value.has(activeInfo.type)
    ? activityInfoMap.value.get(activeInfo.type)
    : activityInfoMap.value.set(activeInfo.type, new Map([[activeInfo.name, { query, id }]]));

  const rootkeyMap = activityInfoMap.value.get(activeInfo.type);
  activitySetLists.add(rootkeyMap);

  if (!rootkeyMap.has(activeInfo.name)) {
    rootkeyMap.set(activeInfo.name, { query, id });
    activityInfoMap.value.set(activeInfo.type, rootkeyMap);

    return true;
  } else {
    return true;
  }
}

onMounted(() => {
  if (content_text.value) {
    mainContentData.msg(content_text.value);
  }
});
</script>

<style scoped lang="scss"></style>
