<template>
  <div v-if="countRef" ref="section">
    <button @click="onClick">点击</button>
    <section
      class="flex pt-5 border_style"
      v-for="event in events"
      :key="event.id"
    >
      <div style="width: 10%">
        <el-avatar :src="event.user.avatarUrl"></el-avatar>
      </div>
      <div style="width: 90%">
        <mainContent :event="event" />
      </div>
    </section>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onUnmounted, watch } from "@vue/runtime-core";
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";

import { getSubScriptDynamic } from "../../../../../api/subscription";
import { useRefNegate } from "../../../../../utils/useRefNegate";
import preview from "../../../../../components/previewpicture";

import mainContent from "./components/mainContent.vue";
import { ElAvatar } from "element-plus";

const store = useStore();

const { countRef, negate } = useRefNegate(false);
const previewImg = new preview();

function onClick() {
  previewImg.mount([]);
}
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
  const res = await getSubScriptDynamic(id);

  lasttime = res.data.lasttime;
  events.value = res.data.event;
}

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
