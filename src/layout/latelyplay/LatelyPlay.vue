<template>
  <div class="bg-white h-full px-2">
    <el-tabs
      v-model="activeName"
      class="demo-tabs h-full overflow-hidden"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :lazy="true"
        label="音乐"
        name="first"
        class="h-full overflow-hidden"
      >
        <PlayerLists :isAppCreate="false" :data="musicCollection" />
      </el-tab-pane>
      <el-tab-pane :lazy="true" label="视频" name="second">视频</el-tab-pane>
      <el-tab-pane :lazy="true" label="MV" name="third">MV</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { computed, onUnmounted, ref, watchEffect } from "vue";
import { useStore } from "vuex";

import { ElTabs, ElTabPane } from "element-plus";
import PlayerLists from "../../components/player/playerlists/PlayerLists.vue";

import type { TabsPaneContext } from "element-plus";
import type { musicDetail } from "../../utils/musicDetail";

const store = useStore();

const activeName = ref("first");

function storeMusicCollection(): {
  stopWatchPlayQueue: ReturnType<typeof watchEffect>;
  musicCollection: musicDetail[];
} {
  const musicCollection = ref<musicDetail[]>([]);

  const lists = computed<musicDetail[]>(
    store.getters["playlist/getMusiclists"]
  );

  const stopWatchPlayQueue = watchEffect(() => {
    //@ts-ignore
    musicCollection.value = lists.value;
  });

  return {
    stopWatchPlayQueue,
    //@ts-ignore
    musicCollection,
  };
}

const { musicCollection, stopWatchPlayQueue } = storeMusicCollection();

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

onUnmounted(() => {
  stopWatchPlayQueue();
});
</script>
<style lang="scss" scoped></style>
