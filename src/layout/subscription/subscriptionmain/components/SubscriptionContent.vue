<template>
  <div v-if="countRef" ref="section">
    <section
      class="flex pt-5 border_style"
      v-for="event in events"
      :key="event.id"
    >
      <div style="width: 10%">
        <el-avatar
          class="cursor-pointer"
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

async function friend() {
  try {
    const res = await getSubScriptDynamic();

    lasttime = res.data.lasttime;
    events.value = res.data.event;

    watchEvent();
  } catch (err) {
    //导航到404页面
    console.log(err);
  }
}

friend();

mitt.on("preview", unMountPrveImage);

function viewScroll(e: Event) {
  console.log(e);
}

function watchEvent() {
  watch(countRef, () => {
    nextTick().then(() => {
      console.log(section.value.scrollHeight);
      // scrollInfo.scrollHeight =;
      section.value.addEventListener("scroll", viewScroll, false);
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
</style>
