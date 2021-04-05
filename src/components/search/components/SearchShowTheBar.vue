<template>
  <div class="search_bar w-64 bg-white absolute top-20 left-0 z-50">
    <div class="text-black p-3 search_user">
      <router-link
        :to="{
          path: '/search',
          query: {
            text: 'dawd',
            type: 1002,
          },
        }"
      >
        搜索"{{ keyword }}"相关用户</router-link
      >
    </div>
    <div>
      <div v-for="searchData in renderData" :key="searchData.type">
        <div
          class="text-black p-2 flex items-center icons buttom_line"
          v-html="typeName(searchData?.type)"
        ></div>
        <ul class="list-none text_color py-2 buttom_line">
          <li
            v-for="musicItem in shwoRes(searchData)"
            :key="musicItem.id"
            v-hover="'#ecf0f1'"
            class="overflow-hidden whitespace-nowrap overflow-ellipsis"
          >
            <router-link
              :to="{ path: '/', query: musicItem?.id }"
              class="flex px-1 py-2"
              v-html="
                musicItemName(
                  keyword,
                  musicItem?.name || musicItem.title,
                  musicItem?.ar || musicItem?.creator
                )
              "
            >
            </router-link>
          </li>
        </ul>
        <div
          class="flex items-center transform translate-x-3 text-black w-full h-full"
        >
          {{ searchData?.moreText }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed } from "@vue/runtime-dom";

interface SingerInfo {
  name: string;
  nickname: string;
}

const props = defineProps({
  keyword: {
    type: String,
    required: true,
  },
  renderData: {
    type: Array,
    required: true,
  },
});

const types = ["song", "palyList", "video"];

const shwoRes = computed(() => {
  return function (res: Record<string, any>) {
    const renderDataType = res?.type + "s";

    return res[renderDataType];
  };
});

const musicItemName = computed(() => {
  return function (
    keywoed: string,
    musicName: string,
    singerInfo: SingerInfo[]
  ) {
    return (
      musicName.replace(
        new RegExp(keywoed, "g"),
        (str) => `<p class="text-blue-600 ">${str}</p>`
      ) +
        "-" +
        singerInfo?.[0]?.name || singerInfo?.[0]?.nickname
    );
  };
});

const typeList = [
  {
    type: "song",
    icon: "icondanqu",
    name: "单曲",
  },
  {
    type: "playList",
    icon: "icongedan",
    name: "歌单",
  },
  {
    type: "video",
    icon: "iconshipin",
    name: "视频",
  },
];

const typeName = computed(() => {
  return (type: string) => {
    const typeItem = typeList.find((key) => key.type === type);

    return `<i class="iconfont ${typeItem?.icon}"></i><p>${typeItem?.name}</p>`;
  };
});
</script>
<style lang="scss" scoped>
.icons {
  @include Iconfont(#000);
}

@mixin buttomLine($backgroundColor) {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: inherit;
  height: 2px;
  background: $backgroundColor;
}

.search_bar {
  box-shadow: 0 4px 7px #555;
}

.text_color {
  color: #555;
}

.search_user {
  position: relative;
  &::after {
    @include buttomLine(rgba(239, 68, 68));
  }
}

.buttom_line {
  position: relative;
  &::after {
    @include buttomLine(#888);
  }
}
</style>
