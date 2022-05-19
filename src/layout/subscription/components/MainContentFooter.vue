<template>
  <section class="flex justify-end w-full h-full">
    <div class="flex items-center justify-end w-1/2 h-full">
      <div
        :class="props.recursion ? setClass('items-end text-sm pb-2') : setClass('items-center ')"
      >
        <span
          v-for="(options, index) in props.info"
          :key="index"
          :ref="(ref) => unref(subInfoEls).push(ref)"
          class="flex justify-center items-center px-4 cursor-pointer"
          @click="!!options?.event?.emit && returnEmit(options.event)"
        >
          <FontIcon v-if="!!options.icon" :icon="icon(options.icon)"></FontIcon>
          <p style="color: #b2bec3" class="text-sm">
            {{ !options.icon ? switchText(options.name) : "" }}
            {{ options.count === 0 ? "" : options.count }}
          </p>
        </span>
      </div>
    </div>
  </section>
</template>
<script setup lang="tsx">
import { computed, ref, shallowRef, unref } from "vue";

import { linkeEvent } from "../methods";
import { diffTime } from "../hooks/diffTime";
import { getStore } from "../../../utils/getStore";

import FontIcon from "../../../components/fonticon/FontIcon.vue";
import Loading from "../../../components/svgloading/SvgLoading.vue";

import type { PropType, Ref } from "vue";

type Options = {
  name: string;
  count: number;
  event?: Record<any, any>;
  icon?: string[] | string;
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
});

const store = getStore();
const isLatestLinke = shallowRef(false);
const linkedCounts = ref(retCount());
const eventMap = new Map();
const subInfoEls = [];

function retCount() {
  return props.info.find((v) => v.name === "linke").count;
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

  const len = props?.latestLikedUsers.length;
  //@ts-ignore
  const userid = userData.value.data.userID;

  if (!userid) return console.error(userid);

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
