<template>
  <section :class="class" class="flex justify-end w-full h-full">
    <div class="flex items-center justify-end w-1/2 h-full">
      <div :class="recursion ? setClass('items-end text-sm pb-2') : setClass('items-center ')">
        <div
          v-for="(options, index) in info"
          :key="index"
          :ref="(ref) => unref(subInfoEls).push(ref)"
          class="flex justify-center items-center px-4 cursor-pointer"
          @click="!!options?.event?.emit && returnEmit(options.event)"
        >
          <FontIcon
            v-if="!!options.icon"
            :size="String(size)"
            :icon="icon(options.icon)"
            :color="options.liked ? '#409EFF' : '#607d8b'"
          ></FontIcon>
          <span style="color: #b2bec3" class="flex items-center">
            <p>{{ !options.icon ? switchText(options.name) : "" }}</p>
            <p class="text-xs">{{ options.count === 0 ? "" : options.count }}</p>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup lang="tsx">
import { computed, ref, shallowRef, unref } from "vue";

import { linkeEvent } from "../methods";
import { getStore } from "../../../utils/getStore";

import FontIcon from "../../../components/fonticon/FontIcon.vue";

import type { PropType } from "vue";

type Options = {
  name: "linke" | "comment" | "forward";
  count: number;
  event?: Record<any, any>;
  icon?: string[] | string;
  liked?: boolean;
};

const ctxEmit = defineEmits(["linke", "comment", "forward"]);

const props = defineProps({
  info: {
    type: Array as PropType<Array<Options>>,
    default: () => [],
  },
  showTime: {
    type: Number,
    default: 0,
  },
  latestLikedUsers: {
    type: Array,
    default: () => [],
  },
  recursion: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 16,
  },
  class: String,
});

const store = getStore();
const isLatestLinke = shallowRef(false);
const linkedCounts = ref(retCount());
const eventMap = new Map();
const subInfoEls = [];

function retCount() {
  return props.info.find((v) => v.name === "linke")?.count || 0;
}

eventMap.set("linke", linkeEvent(linkedCounts, isLatestLinke));

const switchText = (name: string) => {
  let text = "";

  switch (name) {
    case "comment":
      text = "评论";
      break;
    case "forward":
      text = "转发";
      break;
    default:
      text = "";
      break;
  }

  return text;
};

const returnEmit = (event: Record<any, any>) => {
  ctxEmit(event.emit_name, [eventMap.get(event.emit_name)]);
};

const icon = (icons: string | string[] | undefined) => {
  if (!icons) return "";
  const icon = Array.isArray(icons) ? (isLinke ? icons[0] : icons[1]) : icons;
  return icon;
};

const userData = computed(store.getters["login/getUserData"]);

const isLinke = computed(() => {
  if (isLatestLinke.value) return true;

  const len = props?.latestLikedUsers?.length || 0;
  //@ts-ignore
  const userid = userData.value?.data?.userID;
  if (!userid) return console.warn("mainContentFooter:userid");

  if (len === 0 || len === undefined) return false;
  if (len === 1) {
    const isEqual = props.latestLikedUsers[0]["s"] === userid;

    if (isEqual) {
      return true;
    }
  }

  let before = 0;
  let after = len - 1;

  while (true) {
    const beforeId = props.latestLikedUsers[before]["s"];
    const afterId = props.latestLikedUsers[after]["s"];

    if (beforeId == userid || afterId == userid) return true;

    before += 1;
    after -= 1;

    if (before === after + 1 || before > len - 1 || after < 0) return false;
  }
});

if (typeof isLinke.value !== "boolean") {
  isLatestLinke.value = isLinke.value as any;
}

const setClass = (str_class: string) => "flex" + " " + str_class;
</script>
<style scoped lang="scss"></style>
