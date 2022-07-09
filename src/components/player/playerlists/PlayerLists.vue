<template>
  <el-container class="bianshow h-full" style="background: #ffffff">
    <el-header height="80px flex flex-col">
      <div class="flex items-center">
        <span class="font-medium text-lg">当前播放</span>
      </div>
      <div class="flex justify-between py-4">
        <span class="px-2 text-xs" style="color: #f5f7fa"> 共{{ data.length }}首 </span>
        <span class="px-2 text-sm" @click="clearAllPlayList" style="color: #409eff">清空列表</span>
      </div>
    </el-header>
    <el-main>
      <better-scroll
        :item-len="data.length"
        :bs-options="{
          dblclick: true,
        }"
      >
        <el-row
          class="flex py-4"
          v-for="song in data"
          :key="song.id"
          @mouseenter="bgenter(song.id)"
          @mouseleave="bgleave(song.id)"
          @dblclick="dbPlayer(song)"
          :style="{ backgroundColor: currbgid == song.id ? '#e6e8eb' : '#fff' }"
        >
          <el-col :span="2" class="flex items-center justify-center">
            <div
              v-if="songid === song.id"
              class="transform-gpu -rotate-90 flex items-center justify-center"
            >
              <font-icon icon="iconbottom-triangle" size="12"></font-icon>
            </div>
          </el-col>
          <el-col :span="11" class="text-sm"> {{ song.name }} </el-col>
          <el-col :span="8" class="text-sm" v-html="song.nickName"></el-col>
          <el-col :span="3" class="text-sm" style="color: #f0f2f5">
            {{ filterDate(song.dt) }}
          </el-col>
        </el-row>
      </better-scroll>
    </el-main>
  </el-container>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue";
import { useStore } from "vuex";
import dexie from "../../../common/dexie";
import filterDate from "../../../utils/filterDate";
import { musicDetail } from "../../../utils/musicDetail";
import BetterScroll from "../../betterscroll/BetterScroll.vue";
import FontIcon from "../../fonticon/FontIcon.vue";

const props = defineProps({
  data: {
    type: Array as PropType<musicDetail[]>,
    default: () => [],
  },
});

const store = useStore();
const currbgid = ref(null);

function dbPlayer(song: musicDetail) {
  store.commit("playlist/setSongId", song.id); //将第一首歌曲id写入stroe
}

function bgenter(songid: number) {
  currbgid.value = songid;
}

function bgleave(index: number) {
  currbgid.value = null;
}

const songid = computed(store.getters["playlist/getSongId"]);

async function clearAllPlayList() {
  const mydexie = await dexie();
  mydexie.tableDelete();
}
</script>
<style scoped lang="scss">
.bianshow {
  -webkit-box-shadow: -1px 0px 1px 0px rgba(171, 166, 171, 1);
  -moz-box-shadow: -1px 0px 1px 0px rgba(171, 166, 171, 1);
  box-shadow: -1px 0px 1px 0px rgba(171, 166, 171, 1);
}
</style>
