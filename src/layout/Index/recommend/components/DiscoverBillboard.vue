<template>
  <header>
    <div class="flex items-center py-3">
      <div
        class="
          div_yuan
          w-5
          h-5
          bg-red-500
          relative
          flex
          items-center
          justify-center
        "
      >
        <div class="div_yuan w-2 h-2 bg-white"></div>
      </div>
      <p class="text-2xl ml-4">榜单</p>
    </div>
    <div class="w-full h-1 bg-red-500"></div>
  </header>
  <article class="flex mt-6" style="background: #f5f5f5">
    <ul
      v-for="listItme in list"
      :key="listItme.data.playlist.id"
      class="list-none w-1/3 p-6"
    >
      <div class="flex pb-6">
        <a :href="listItme.data.playlist.id">
          <img
            :src="listItme.data.playlist.coverImgUrl + '?param=100y100'"
            alt=""
            class="listImg"
          />
        </a>
        <span class="flex flex-col ml-6">
          <p class="text-2xl">{{ listItme.data.playlist.name }}</p>
          <div class="icons">
            <i class="iconbofang mr-3"></i>
            <i class="icon-tainjia mr-3"></i>
          </div>
        </span>
      </div>
      <li
        v-for="track in sliceTracks(listItme.data.playlist.tracks)"
        :key="track.al.id"
        class="flex items-center pt-2 pb-2 pr-2"
        @mouseenter="onMouseEnter(track.index, track)"
        @mouseleave="
          iconActive = Number.MAX_VALUE;
          userid = Number.MAX_VALUE;
        "
      >
        <h3 :class="{ topTree: track.index + 1 <= 3 }" class="text-lg">
          {{ track.index + 1 }}
        </h3>
        <a
          :href="track.al.id"
          :title="track.al.name"
          class="ml-3 w-4/6 truncate"
          >{{ track.al.name }}</a
        >
        <div
          class="iconss flex justify-end w-1/3"
          ref="icon"
          :class="
            track.id === userid && iconActive === track.index
              ? 'block'
              : 'hidden'
          "
        >
          <a href="#" title="播放" class="iconbofang"></a>
          <a href="#" title="添加到播放列表" class="iconjia"></a
          ><a href="#" title="收藏" class="iconshoucang"></a>
        </div>
      </li>
    </ul>
  </article>
</template>
<script setup lang="ts">
import { ref, shallowRef } from "@vue/reactivity";
import { computed } from "@vue/runtime-core";

import { getTopList } from "../../../../api/discover/mainRequest";

const list = ref<any>([]);
const iconActive = ref(Number.MAX_VALUE);
const userid = shallowRef(Number.MAX_VALUE);

getTopList({
  method: "GET",
  url: "/toplist",
}).then((res: any[]) => (list.value = res));

const onMouseEnter = (index: number, track: Record<string, any>) => {
  iconActive.value = index;
  userid.value = track.id;
};

const sliceTracks = computed(() => {
  return function (tracks: Array<Record<string, any>>): Record<string, any>[] {
    if (!tracks) return [];

    return tracks.slice(0, 10).map((v, i) => ({ ...v, index: i }));
  };
});
</script>
<style lang="scss" scoped>
.listImg {
  background-image: linear-gradient(45deg, #f5f5f5, #fff);
  box-shadow: 1px 3px #cecccc;
}

.icons {
  @include Iconfont(16px, #f2f2f2);
}

.iconss {
  @include Iconfont(16px, #f2f2f2);
}

.topTree {
  color: #c10d0c;
}
</style>
