<template>
  <div v-if="countRef" ref="section">
    <section class="flex pt-5 border_style" v-for="event in events" :key="event.id">
      <div style="width: 10%">
        <router-link
          :to="{
            path: '/user/home',
            query: event.user.userId
          }"
        >
          <el-avatar :src="event.user.avatarUrl"></el-avatar>
        </router-link>
      </div>
      <div style="width: 90%">
        <MainContent @emitPics="onClick" :event="event" />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { getCurrentInstance, nextTick, onDeactivated, onUnmounted, watch } from "@vue/runtime-core";
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";

import { getSubScriptDynamic } from "../../../../api/subscription";
import { useRefNegate } from "../../../../utils/useRefNegate";
import preview from "../../../../components/previewpicture";

import MainContent from "./layout/MainContent.vue";
import { ElAvatar } from "element-plus";

import type { Emitter } from "mitt"

const store = useStore();
const instance = getCurrentInstance()

const mitt: Emitter = instance.appContext.config.globalProperties["mittBus"]

const { countRef, negate } = useRefNegate(false);
const previewImg = new preview();

//@ts-ignore
const events = ref([]);
const section = ref<HTMLElement | null>(null);
let lasttime = 0;

const scrollInfo = reactive({
  scrollHeight: 0,
});

store.watch(
  () => store.state.userInfo,
  (value) => {
    if (!value) return;
    getFriend(value.id);
    negate();
  },
  { immediate: true }
);

async function getFriend(id: number) {
  try {
    const res = await getSubScriptDynamic(id);

    lasttime = res.data.lasttime;
    events.value = res.data.event;
  } catch (err) {
    //导航到404页面
    console.log(err);
  }
}

mitt.on("preview", onClick)

function onScroll(e: Event) {
  console.log(e);
}

const stopScroll = watch(events, () => {
  nextTick().then(() => {
    // console.dir(section.value);
    scrollInfo.scrollHeight = section.value.scrollHeight;

    section.value.addEventListener("scroll", onScroll, false);
  });
});



function onClick(picInfo: any[]) {
  previewImg.mount(picInfo[0], picInfo[1]);
}


onDeactivated(() => {
  previewImg.unmount(true)
})

onUnmounted(() => {
  stopScroll();

  if (section.value) {
    section.value.addEventListener("scroll", onScroll, false);
  }
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
