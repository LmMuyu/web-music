<template>
  <div
    v-if="countRef"
    ref="section"
    class="overflow-y-scroll relative scroll_bar h_calc"
  >
    <section
      class="flex pt-4 border_style"
      v-for="event in events"
      :key="event.id"
    >
      <div style="width: 10%" class="flex justify-center">
        <el-avatar
          class="cursor-pointer"
          size="medium"
          :src="event.user.avatarUrl"
          @click="
            router.push({
              path: '/user/home',
              query: { uid: event.user.userId },
            })
          "
        ></el-avatar>
      </div>
      <div style="width: 90%">
        <MainContent @emitPics="unMountPrveImage" :event="event" />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import {
  getCurrentInstance,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  watch,
} from "@vue/runtime-core";
import { reactive, ref } from "@vue/reactivity";
import { useRouter } from "vue-router";

import { getSubScriptDynamic } from "../../../../api/subscription";
import { useRefNegate } from "../../../../utils/useRefNegate";
import preview from "../../../../components/previewpicture";
import { throttle } from "../../../../utils/throttle";

import MainContent from "./layout/MainContent.vue";
import { ElAvatar } from "element-plus";

import type { Emitter } from "mitt";

const instance = getCurrentInstance();
const router = useRouter();
const mitt: Emitter = instance.appContext.config.globalProperties["mittBus"];

const { countRef, negate } = useRefNegate(false);
let previewImg = new preview();

//@ts-ignore
const events = ref([]);
const section = ref<HTMLElement | null>(null);
let lasttime = 0;

const scrollInfo = reactive({
  scrollHeight: 0,
});

let initwatch = false;

async function friend(lasttime: number = -1) {
  try {
    const res = await getSubScriptDynamic(lasttime);

    lasttime = res.data.lasttime;
    events.value.push(...res.data.event);

    !initwatch && watchEvent();
  } catch (err) {
    //导航到404页面
    console.log(err);
  }
}

friend();

mitt.on("preview", unMountPrveImage);

let requestmidd = false;

function viewScroll(e: Event) {
  const target = e.target as HTMLElement;
  const scrollTop = target.scrollTop;

  const percentage =
    Number((scrollTop / scrollInfo.scrollHeight).toFixed(2)) * 100;

  if (percentage >= 90 && !requestmidd) {
    requestmidd = true;

    friend(lasttime);
  }
}

function watchEvent() {
  console.log("watchEvent");

  initwatch = true;
  const stop = watch(countRef, () => {
    nextTick().then(() => {
      scrollInfo.scrollHeight = section.value.scrollHeight;

      const loadingScroll = throttle(viewScroll, 100);
      section.value.addEventListener("scroll", loadingScroll, false);

      stop();
    });
  });

  negate();
}

function unMountPrveImage(picInfo: any[]) {
  previewImg.mount(picInfo[0], picInfo[1]);
}

onActivated(() => {
  previewImg = new preview();
});

onDeactivated(() => {
  previewImg.unmount(true);
});

onMounted(() => {});

onUnmounted(() => {
  // section.value.removeEventListener("scroll", viewScroll, false);
});
</script>
<style scoped lang="scss">
.border_style {
  position: relative;
  & ::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    width: 100%;
    background-color: #dfe6e9;
  }
}

.h_calc {
  height: calc(100% - 40px);
}
.scroll_bar {
  &::-webkit-scrollbar {
    display: none;
  }
}

.scroll_botton {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}
</style>
