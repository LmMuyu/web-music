<template>
  <el-container v-for="(card, index) in listData" :key="index">
    <el-main>
      <el-header>
        <ToplistMainHeader :headerInfo="headerInfo(card)" />
      </el-header>
      <el-container>
        <el-main>
          <card-row
            @mutationSetName="mutation(card)"
            :playlist="card.tracks.splice(0, 20)"
          ></card-row>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { defineProps, ref } from "@vue/runtime-core";
import { useStore } from "vuex";

import { createLoading } from "../../../../components/loading/app";
import { getMittBus } from "../../../../utils/mittBus";

import { ElContainer, ElMain, ElHeader } from "element-plus";
import CardRow from "../../../../components/card/CardRow.vue";
import ToplistMainHeader from "./ToplistMainHeader.vue";

import type { PropType } from "@vue/runtime-core";

const ctxEmit = defineEmits(["retcardname"]);

const props = defineProps({
  listData: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  selectAll: {
    type: Boolean,
    default: true,
  },
  closeLoading: {
    type: Boolean,
    default: false,
  },
  isRank: {
    type: Boolean,
    default: true,
  },
  openVirtuallist: {
    type: Boolean,
    default: true,
  },
  isCheckbox: {
    type: Boolean,
    default: true,
  },
});

const store = useStore();

const { countRef, negate, mountApp, unmountApp, isMountApp } = new createLoading();
const mittBus = getMittBus();

const rootcontent = ref<HTMLElement | null>(null);
const busMap = mittBus.all;

function headerInfo(card: any) {
  return {
    id: card.id,
    name: card.name,
    shareCount: card.shareCount,
    commentCount: card.commentCount,
    trackUpdateTime: card.trackUpdateTime,
  };
}

function mutation(card: any) {
  store.commit("toplist/setCurrTag", card.name);
  ctxEmit("retcardname", card);
}

// if (!busMap.has("markvrituallist")) {
//   mittBus.on("markvrituallist", () => {
//     countRef.value = false;

//     if (!isMountApp() && rootcontent.value) {
//       console.log(isMountApp());
//       mountApp(rootcontent.value);
//     }
//   });
// }
</script>
<style scoped lang="scss">
.borderslode {
  border-bottom: 1px solid;
}

.borderslode {
  border-bottom: 1px solid #ecf0f1;
}
</style>
