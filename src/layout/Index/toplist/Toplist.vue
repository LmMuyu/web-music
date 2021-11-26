<template>
  <div class="flex flex-col w-full h-full">
    <ToplistMainContent :listData="mainConatinerData" @retcardname="commitStateList" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";

import ToplistMainContent from "./components/ToplistMainContent.vue";

import { toplistData } from "../../../api/toplist";
import { getlistDetailData } from "./hooks/request";
import { musicDetail } from "../../../utils/musicDetail";

import type { NodeAttribute } from "../../../utils/LRUCache";

const props = defineProps({
  seelp: {
    type: Number,
    default: 1,
  },
});

const store = useStore();

function commitStateList(data: any) {
  const listMaps = store.getters["toplist/retListMaps"];
  const islogin = store.getters["login/getIslogin"];

  if (!islogin) {
    const lists = (data.tracks as any[]).map((musicData) => {
      const musicInfo = listMaps.get(musicData.id);

      if (musicInfo) {
        return musicInfo;
      }

      return new musicDetail(musicData);
    });

    store.commit("toplist/setLists", {
      name: data.name,
      data: lists,
    });
  }
}

const mainConatinerData = ref<NodeAttribute[]>([]);

toplistData()
  .then((list) => {
    const cardlist = list.data.list;
    return cardlist.slice(0, 4);
  })
  .then(async (cards: any[]) => {
    mainConatinerData.value = await getlistDetailData(cards.map((c) => c.id));
  });
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}
</style>
