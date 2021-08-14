<template>
  <section class="footer_heigth flex w-full h-full">
    <div class="w-1/2 h-full"></div>
    <div
      :class="recursion ? 'items-end text-sm pb-2' : 'items-center'"
      class="flex justify-end w-1/2 h-full"
    >
      <span
        class="flex justify-center items-center px-4 cursor-pointer icons"
        @click="onLinke"
      >
        <i class="iconfont" :class="isLinke ? 'icondianzan1' : 'iconzan'"></i>
        <p style="color: #b2bec3" class="text-sm">
          {{ linkedCounts === 0 ? "" : `(${linkedCounts})` }}
        </p>
      </span>
      <span class="flex justify-center items-center px-4 cursor-pointer">
        <p>转发</p>
        <p style="color: #b2bec3" class="text-sm">
          {{ linkedCounts === 0 ? "" : `(${linkedCounts})` }}
        </p>
      </span>
      <span class="flex justify-center items-center px-4 cursor-pointer">
        <p>分享</p>
        <p style="color: #b2bec3" class="text-sm">
          {{ linkedCounts === 0 ? "" : `(${linkedCounts})` }}
        </p>
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, defineEmits, ref, shallowRef } from "vue";
import { useStore } from "vuex";

import type { State } from "../../../../../store/type";

const ctxEmit = defineEmits(["linke"]);

const props = defineProps({
  likedCount: {
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

const store = useStore();
const state = store.state as State;
const isLatestLinke = shallowRef(false);
const linkedCounts = ref(props.likedCount);

const onLinke = () =>
  ctxEmit(
    "linke",
    (res: any) => {
      const islinke = JSON.parse(res.config.data)["t"];

      if (islinke === 1 && res.data.code === 200) {
        linkedCounts.value += 1;
        isLatestLinke.value = true;
      } else {
        linkedCounts.value -= 1;
        isLatestLinke.value = false;
      }
    },
    isLatestLinke.value
  );

const isLinke = computed(() => {
  if (isLatestLinke.value) return true;

  const len = props.latestLikedUsers.length;
  const userid = state.userInfo.userID;

  if (len === 0) return false;

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

isLatestLinke.value = isLinke.value;
</script>
<style scoped lang="scss">
.footer_heigth {
  height: 60px;
}

.icons {
  @include Iconfont(#74b9ff, 16);
}
</style>
