<template>
  <div class="flex flex-col w-full h-full">
    <el-container v-for="(card, index) in mainConatinerData" :key="index">
      <el-main v-if="!!card">
        <el-header>
          <ToplistMainHeader :headerInfo="headerInfo(card)" />
        </el-header>
        <el-container>
          <el-main>
            <card-row @mutationSetName="mutation" :playlist="card.tracks.splice(0, 20)"></card-row>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";

import { toplistData } from "../../../api/toplist";
import { getTopListDetailData } from "./hooks/request";
import { musicDetail } from "../../../utils/musicDetail";
import createDexie from "../../../utils/dexie";

import { ElContainer, ElMain, ElHeader } from "element-plus";
import CardRow from "../../../components/card/CardRow.vue";
import ToplistMainHeader from "./components/ToplistMainHeader.vue";

import type { ListItem } from "./types/requestType";

const store = useStore();

const dbMethods = createDexie();

const mainConatinerData = ref<ListItem[]>(new Array(4).fill(undefined));

function headerInfo(card: any) {
  return {
    id: card.id,
    name: card.name,
    shareCount: card.shareCount,
    commentCount: card.commentCount,
    trackUpdateTime: card.trackUpdateTime,
  };
}

async function mutation(card: any) {
  console.log(card);
  store.commit("toplist/setCurrTag", card.name);

  // (await dbMethods).addData({
  //   data: card,
  //   updateTime: Date.now(),
  // });
}

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

toplistData()
  .then((list) => {
    const cardlist = list.data.list;
    return cardlist.slice(0, 4);
  })
  .then((cards: any[]) => {
    cards.map(async (c, i) => {
      mainConatinerData.value[i] = await getTopListDetailData(c.id);
    });
  });
</script>
<style lang="scss" scoped>
.border {
  box-shadow: 0px 0px 2px #ecf0f1;
}

.borderslode {
  border-bottom: 1px solid;
}

.borderslode {
  border-bottom: 1px solid #ecf0f1;
}
</style>
