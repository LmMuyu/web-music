<template>
  <ElRow :class="class">
    <ElCol :span="10" class="flex">
      <div>
        <router-link :to="{ path: '/playlist', query: { id: track.id } }" class="blockpx-4">
          <ElImage
            :lazy="true"
            shape="square"
            :src="track.picUrl + '?param=32y32'"
            class="w-10 h-10 rounded-md"
          />
        </router-link>
      </div>
      <div class="flex flex-col w-full px-2">
        <router-link :to="{ path: '/playlist', query: { id: track.id } }" class="block">
          {{ track.name }}
        </router-link>
        <span class="text-sm" v-html="track.nickName"></span>
      </div>
    </ElCol>
    <ElCol :span="10" class="flex items-center text-sm">
      <router-link :to="{ path: '/playlist', query: { id: track.id } }" class="block w-full">
        {{ track.name }}
      </router-link>
    </ElCol>
    <ElCol :span="4" class="flex items-center">
      <font-icon
        @click="playmusic(track.id)"
        :icon="songid === track.id ? 'iconpause' : 'iconbofang1'"
      ></font-icon>
    </ElCol>
  </ElRow>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { computed, PropType } from "vue";

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
</script>
<style scoped lang="scss"></style>
