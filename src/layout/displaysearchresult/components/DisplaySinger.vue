<template>
  <div class="h-full">
    <better-scroll :isminusviewposth="true" :open-h-render="false" :item-len="lists.length">
      <el-row class="py-2 w-full" v-for="(singer, index) in lists" :key="index">
        <el-col :span="22" class="flex items-center">
          <el-row class="w-full" :align="'middle'">
            <el-col :span="2">
              <el-image
                class="w-16 h-16 rounded-md"
                :src="singer.coverImgUrl + '?param=64y64'"
              ></el-image>
            </el-col>
            <el-col :span="22">
              <router-link
                :to="{
                  path: singer.path,
                  query: { uid: singer.id },
                }"
                class="text-sm"
                style="color: #303133"
              >
                {{ singer.name }}
              </router-link>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="2" class="flex items-center justify-center">
          <router-link v-if="singer.isuser" :to="{ path: singer.path }">
            <font-icon color="#F56C6C" size="16" icon="iconren-"></font-icon>
          </router-link>
        </el-col>
      </el-row>
      <slot></slot>
    </better-scroll>
  </div>
</template>
<script setup lang="ts">
import { ElImage, ElRow, ElCol } from "element-plus";
import { onUnmounted, PropType, ref, watchEffect } from "vue";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import FontIcon from "../../../components/fonticon/FontIcon.vue";
import { musicDetail } from "../../../utils/musicDetail";

import type { transformArtistData } from "../../user/home/hooks/Home";

type MyReturn<T> = T extends (...arg: any) => infer R ? R : never;

const props = defineProps({
  data: {
    type: Array as unknown as PropType<MyReturn<typeof transformArtistData>[]>,
    default: () => [],
  },
});

const lists = ref<MyReturn<typeof transformArtistData>[]>([]);

const stop = watchEffect(() => {
  const data = props.data;
  const issong = data[0] instanceof musicDetail;

  if (!issong) {
    lists.value = data;
  }
});

onUnmounted(() => {
  stop();
});
</script>
<style scoped lang="scss">
.content {
  &:deep(.content_grid) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 16px 16px;
  }
}
</style>
