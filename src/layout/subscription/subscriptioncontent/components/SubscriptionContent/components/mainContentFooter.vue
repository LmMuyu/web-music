<template>
  <section class="footer_heigth flex w-full h-full">
    <div class="w-1/2 h-full"></div>
    <div class="flex justify-end items-center w-1/2 h-full">
      <span
        class="flex justify-center items-center px-4 cursor-pointer icons"
        @click="onLinke"
      >
        <i
          class="iconfont icondianzan1"
          :class="{ 'text-red-400': isLinke }"
        ></i>
        <p style="color: #b2bec3" class="text-sm">
          {{ likedCount === 0 ? "" : `(${likedCount})` }}
        </p>
      </span>
      <span class="flex justify-center items-center px-4 cursor-pointer">
        <p>转发</p>
        <p style="color: #b2bec3" class="text-sm">
          {{ likedCount === 0 ? "" : `(${likedCount})` }}
        </p>
      </span>
      <span class="flex justify-center items-center px-4 cursor-pointer">
        <p>分享</p>
        <p style="color: #b2bec3" class="text-sm">
          {{ likedCount === 0 ? "" : `(${likedCount})` }}
        </p>
      </span>
    </div>
  </section>
</template>
<script setup lang="ts">
import { computed, defineEmit, shallowRef } from "vue";
import { useStore } from "vuex";

import type { State } from "../../../../../../store/type";

const ctxEmit = defineEmit(["linke"]);

const props = defineProps({
  likedCount: {
    type: Number,
    default: 0,
  },
  latestLikedUsers: {
    type: Array,
    default: () => [],
  },
});

const onLinke = () =>
  ctxEmit("linke", (res: any) => {
    console.log(res);
  });

const store = useStore();
const state = store.state as State;
const isLatestLinke = shallowRef(false);

const isLinke = computed(() => {
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
  @include Iconfont(#74b9ff, 18);
}
</style>
