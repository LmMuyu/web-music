<template>
  <div class="inline-flex justify-between ml-6 mr-6 bottom_line">
    <p class="text-left text-xl">入住歌手</p>
    <p class="text-right">
      <a href="javscript:void(0)" class="underline text-xl">查看更多></a>
    </p>
  </div>
  <div class="ml-6 mr-6">
    <ul class="list-none">
      <li v-for="singer in singerArtists" :key="singer.id" class="pt-2 pb-2">
        <a href=";;" class="flex">
          <div>
            <img
              :src="
                (singer.detailDesc?.profile?.avatarUrl ||
                  singer.detailDesc?.profile?.backgroundUrl ||
                  singer.img1v1Url) + '?param=62y62'
              "
              :alt="singer.detailDesc.profile?.nickname"
            />
          </div>
          <div class="flex flex-col pl-3 bg-gray-100 introduction">
            <p>
              {{ singer.detailDesc.profile?.nickname }}
            </p>
            <p
              class="text-xs text-gray-400 mt-3 overflow-hidden whitespace-nowrap overflow-ellipsis"
            >
              简介：
              {{
                singer.detailDesc?.profile?.description ||
                singer.detailDesc?.profile?.detailDescription ||
                singer.detailDesc?.identify?.imageDesc
              }}
            </p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "@vue/reactivity";
import { getCheckInSinger } from "../../../../api/indexasideright/index";

const singerArtists = ref<any[]>([]);

getCheckInSinger({
  url: "/artist/list",
  method: "GET",
  params: {
    initial: 0,
    limit: 5,
    type: -1,
    area: 7,
  },
}).then((res) => (singerArtists.value = res));
</script>
<style lang="scss" scoped>
.bottom_line {
  position: relative;
  width: calc(100% - 24px - 24px);
  ::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    display: block;
    border: 1px solid #ecf0f1;
  }
}

.introduction {
  width: 150px;
}
</style>
