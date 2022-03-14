<template>
  <div class="content">
    <better-scroll class="content_grid">
      <div v-for="(item, index) in lists" :key="index" class="p-4 relative">
        <el-image class="rounded-md w-32 h-32" :src="item.picUrl + '?param=128y128'" />
        <div>歌手:{{ item.name }}</div>
        <router-link
          class="absolute top-0 left-0 h-full w-full block"
          to="javascript:void(;)"
        ></router-link>
      </div>
    </better-scroll>
  </div>
</template>
<script setup lang="ts">
import { ElImage } from "element-plus";
import { onUnmounted, ref, watchEffect } from "vue";
import BetterScroll from "../../../components/betterscroll/BetterScroll.vue";
import { musicDetail } from "../../../utils/musicDetail";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

const lists = ref([]);

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
