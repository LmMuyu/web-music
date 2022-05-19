<template :root="true">
  <div v-if="countRef" ref="section" class="relative h_calc" :class="class">
    <better-scroll :open-upload="true" :item-len="events.length" @pull-up-load="loadData">
      <slot></slot>
      <el-row class="flex pt-4" v-for="event in events" :event_id="event.id" :key="event.id">
        <el-col :span="2" class="flex justify-start">
          <el-avatar
            class="cursor-pointer"
            size="medium"
            :src="event.user.avatarUrl"
            @click="router.push({ path: '/user/home', query: { uid: event.user.userId } })"
          ></el-avatar>
        </el-col>
        <el-col :span="22">
          <main-content :event="event" />
        </el-col>
      </el-row>
    </better-scroll>
  </div>
</template>
<script setup lang="ts">
import { nextTick, watch, reactive, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

import { getSubScriptDynamic } from "../../../api/subscription";
import { useRefNegate } from "../../../utils/useRefNegate";
import { throttle } from "../../../utils/throttle";

import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import { ElAvatar, ElRow, ElCol } from "element-plus";
import MainContent from "./MainContent.vue";

const props = defineProps({
  event: Array,
  class: String,
  isPullUpData: {
    type: Boolean,
    default: true,
  },
});

const router = useRouter();

const { countRef, negate } = useRefNegate(false);

//@ts-ignore
const events = ref([]);
const section = ref<HTMLElement | null>(null);
let lasttime = 0;

const scrollInfo = reactive({
  scrollHeight: 0,
});

let initwatch = false;
let watchStop = null;

async function friend(requestTime: number = -1) {
  try {
    const res = await getSubScriptDynamic(requestTime);
    lasttime = res.data.lasttime;
    events.value.push(...res.data.event);

    !initwatch && watchEvent();
    return true;
  } catch (err) {
    //导航到404页面
    console.log(err);
  }
}

if (!props.event) {
  friend();
} else {
  watchEvents();
}

function watchEvents() {
  if (watchStop) {
    watchStop();
    watchStop = null;
  }

  watchStop = watchEffect(() => {
    if (props.event && props.event.length > 0) {
      events.value = props.event;

      nextTick(() => {
        !initwatch && watchEvent();
      });
    }
  });
}

async function loadData([resolve, reject]) {
  resolve(true);
  // if (!props.isPullUpData) return  resolve(true );

  // try {
  //   await friend(lasttime);
  //   resolve(true);
  // } catch (error) {
  //   reject(false);
  // }
}

let requestmidd = false;

function viewScroll(e: Event) {
  const target = e.target as HTMLElement;
  const scrollTop = target.scrollTop;

  const percentage = Number((scrollTop / scrollInfo.scrollHeight).toFixed(2)) * 100;

  if (percentage >= 90 && !requestmidd) {
    requestmidd = true;
    friend(lasttime);
  }
}

function watchEvent() {
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
</script>
<style scoped lang="scss">
.h_calc {
  height: calc(100% - 40px);
}
</style>
