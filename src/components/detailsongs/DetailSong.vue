<template>
  <ElRow :class="class">
    <ElCol :span="8" class="flex items-center">
      <span class="px-2">
        {{ String(index + 1).padStart(2, "0") }}
      </span>
      <router-link
        :to="{ path: '/playlist', query: { id: track.id } }"
        class="block px-4"
      >
        <ElImage
          shape="square"
          :src="track.picUrl + '?param=32y32'"
          class="w-8 h-8 rounded-md"
          :lazy="true"
          loading="lazy"
        />
      </router-link>
      <router-link
        :to="{ path: '/playlist', query: { id: track.id } }"
        class="block px-2"
      >
        {{ track.name }}
      </router-link>
    </ElCol>
    <el-col class="flex justify-center flex-col w-full px-2" :span="6">
      <span class="text-sm" v-html="track.nickName"></span>
    </el-col>
    <ElCol :span="6" class="flex items-center justify-center text-sm">
      <router-link
        :to="{ path: '/playlist', query: { id: track.id } }"
        class="block w-full"
      >
        {{ track.name }}
      </router-link>
    </ElCol>
    <el-col :span="2" class="flex items-center justify-center text-sm">
      {{ filterDate(track.dt) }}
    </el-col>
    <ElCol :span="2" class="flex items-center justify-center">
      <font-icon
        @click="playmusic(track.id)"
        size="20"
        color="#303133"
        :icon="songid === track.id ? 'iconzantingtingzhi' : 'iconbofang3'"
      ></font-icon>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { computed, onUnmounted, PropType } from "vue";

import filterDate from "../../utils/filterDate";

import { ElRow, ElCol, ElImage } from "element-plus";
import FontIcon from "../fonticon/FontIcon.vue";

import type { musicDetail } from "../../utils/musicDetail";

const props = defineProps({
  track: {
    type: Object as PropType<musicDetail>,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  class: {
    type: String,
    default: "",
  },
});

const store = useStore();
const songid = computed(store.getters["playlist/getSongId"]);

function playmusic(id: number) {
  store.commit("playlist/setSongId", id);
}

onUnmounted(() => {
  props.track.stop();
});
</script>
<style scoped lang="scss"></style>
